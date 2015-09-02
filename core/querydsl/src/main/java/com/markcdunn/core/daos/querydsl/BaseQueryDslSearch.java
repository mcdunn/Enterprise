package com.markcdunn.core.daos.querydsl;

import com.markcdunn.core.daos.search.Search;
import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SearchResult;
import com.markcdunn.core.daos.search.SearchResults;
import com.markcdunn.core.daos.search.SearchResultsImpl;
import com.markcdunn.core.daos.search.SortDirectionEnum;
import com.markcdunn.core.daos.search.SortOrder;
import com.markcdunn.core.daos.search.SortOrderList;
import com.markcdunn.core.entities.BaseEntity;
import com.markcdunn.core.model.Entity;
import com.mysema.query.Query;
import com.mysema.query.jpa.impl.JPAQuery;
import com.mysema.query.types.EntityPath;
import com.mysema.query.types.Order;
import com.mysema.query.types.OrderSpecifier;
import com.mysema.query.types.Path;
import com.mysema.query.types.expr.BooleanExpression;
import com.mysema.query.types.expr.SimpleExpression;
import com.mysema.query.types.path.StringPath;
import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Search base class implementation which uses QueryDsl.
 * 
 * @param <I> Entity class interface
 * @param <E> Entity class
 * @param <K> Entity class key
 */
public abstract class BaseQueryDslSearch<I extends Entity, E extends BaseEntity<K>, K>
        implements Search<I> {

    private static Logger log = LoggerFactory.getLogger(BaseQueryDslSearch.class);

    private EntityManager entityManager;

    protected void setEntityManager(EntityManager em) {
        this.entityManager = em;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long count(SearchCriteria<I> criteria) {
        return 0L;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<I> search(SearchCriteria<I> searchCriteria) {

        JPAQuery query = generateSearchQuery(searchCriteria);

        Long offsetLong = query.getMetadata().getModifiers().getOffset();
        long offset = offsetLong != null ? offsetLong : 0;

        Long limitLong = query.getMetadata().getModifiers().getLimit();
        long limit = limitLong != null ? limitLong : 0;

        SearchResultsImpl<I> results = new SearchResultsImpl<>();
        results.setOffset(offset);
        results.setMaxItems(limit);

        // Count total results
        if (searchCriteria.getPerformCount() || (limit > 0)) {
            long total = query.count();
            results.setTotalCount(total);
            if (total != 0) {
                // Reset the query modifiers as QueryDsl will null modifiers after count query is executed
                query.offset(offset);

                // Reset limit (may not be needed)
                if (limit > 0) {
                    query.limit(limit);
                }
            }
        }

        List<I> entityList = new ArrayList<>();
        for (E entity : getEntities(getEntityPath(), query)) {
            entityList.add((I) entity);
        }
        results.setResults(entityList);
        if (!searchCriteria.getPerformCount() && (limit == 0)) {
            results.setTotalCount(entityList.size());
        }

        return results;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<? extends SearchResult> search(SearchCriteria<I> searchCriteria,
            Class<? extends SearchResult> searchResultClass) {
        SearchResults<I> searchResults = search(searchCriteria);
        List<SearchResult<I>> lookupResults = new ArrayList<>();
        SearchResult<I> searchResultInstance;
        try {
            searchResultInstance = searchResultClass.newInstance();
            for (I entity : searchResults.getResults()) {
                lookupResults.add(searchResultInstance.newInstance(entity));
            }
            SearchResultsImpl<SearchResult<I>> finalResults = new SearchResultsImpl<>();
            finalResults.setOffset(searchResults.getOffset());
            finalResults.setMaxItems(searchResults.getMaxItems());
            finalResults.setTotalCount(searchResults.getTotalCount());
            finalResults.setResults(lookupResults);
            return finalResults;
        }
        catch(InstantiationException e) {
            log.error("Unable to instantiate search result object:" + searchResultClass);
            return null;
        }
        catch(IllegalAccessException e) {
            log.error("Unable to instantiate search result object:" + searchResultClass);
            return null;
        }
    }

    protected List<E> getEntities(EntityPath<E> entityPath, JPAQuery query) {
        return query.list(entityPath);
    }

    protected JPAQuery generateSearchQuery(SearchCriteria<I> searchCriteria) {
        JPAQuery query = new JPAQuery(entityManager).from(getEntityPath());

        addSearchCriteria(query, searchCriteria);

        // Limit the rows to the range requested
        configureRange(query, searchCriteria.getOffset(), searchCriteria.getMaxItems());

        // Add an order by clause to sort the results
        configureSorting(query, getEntityPath(), searchCriteria.getSortOrderList());

        return query;
    }

    protected void configureSorting(JPAQuery query, EntityPath<E> entityPathBase, SortOrderList sortOrderList) {
        configureOrderBy(query, entityPathBase, filterSortOrderList(sortOrderList));
    }

    protected void configureRange(JPAQuery query, long offset, long maxItems) {
        // offset
        if (offset > 0) {
            query.offset(offset);
        }
        else {
            query.offset(0L);
        }

        // max items
        if (maxItems > 0) {
            query.limit(maxItems);
        }
    }

    /**
     * This method may be overridden by sub-classes to add entity-specific search criteria.
     *
     * @param query JPAQuery object to add criteria to
     * @param searchCriteria the search criteria to use while searching
     */
    protected abstract void addSearchCriteria(JPAQuery query, SearchCriteria<I> searchCriteria);

    /**
     * Used by the abstract implementation to get the correct QueryDSL Entity object.
     * 
     * @return QueryDSL Entity Path Base
     */
    protected abstract EntityPath<E> getEntityPath();

    /**
     * Subclasses should override as needed. Provides ability to filter sort order prior to application.
     * 
     * @param sortOrderList Sort Order List
     * @return filtered Sort Order List
     */
    protected abstract SortOrderList filterSortOrderList(SortOrderList sortOrderList);

    public static void configureLimits(Query<?> query, long offset, long maxItems) {
        if (offset > 0) {
            query.offset(offset);
        }
        else {
            query.offset(0L);
        }

        if (maxItems > 0) {
            query.limit(maxItems);
        }
        else {
        }
    }

    public static void configureOrderBy(Query<?> query, Path<?> entry, SortOrderList sortOrderList) {
        if ((sortOrderList != null) && (sortOrderList.size() > 0)) {
            List<OrderSpecifier<?>> specifiers = new ArrayList<>();
            for (SortOrder sortOrder : sortOrderList) {
                Order order = Order.ASC;
                if (sortOrder.getSortDirection() == SortDirectionEnum.DESC) {
                    order = Order.DESC;
                }
                StringPath property = new StringPath(entry, sortOrder.getSortField());
                specifiers.add(new OrderSpecifier<>(order, property));
            }
            query.orderBy(specifiers.toArray(new OrderSpecifier[specifiers.size()]));
        }
    }

    public static <T> BooleanExpression buildInExpression(SimpleExpression<T> property, Collection<T> collection) {
        if (CollectionUtils.isEmpty(collection)) {
            return property.in(new ArrayList<T>());
        }

        BooleanExpression exp = null;
        final List<T> values = new ArrayList<>(collection);
        final int parameterLimit = 999;
        final int listSize = values.size();
        for (int i = 0; i < listSize; i += parameterLimit) {
            List<T> subList;
            if (listSize > i + parameterLimit) {
                subList = values.subList(i, (i + parameterLimit));
            }
            else {
                subList = values.subList(i, listSize);
            }

            if (exp != null) {
                exp = exp.or(property.in(subList));
            }
            else {
                exp = property.in(subList);
            }
        }

        return exp;
    }
}
