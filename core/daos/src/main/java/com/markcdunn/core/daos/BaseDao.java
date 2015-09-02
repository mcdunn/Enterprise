package com.markcdunn.core.daos;

import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.EntityManager;

import com.markcdunn.core.daos.search.Search;
import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SearchResult;
import com.markcdunn.core.daos.search.SearchResults;
import com.markcdunn.core.entities.BaseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Abstract base class for JPA Entity DAO implementations.
 * 
 * Handles direct interaction with the EntityManager.
 *
 * @param <I> The entity interface for this DAO.
 * @param <E> The entity for this DAO.
 * @param <K> The key for the entity for this DAO.
 */
public abstract class BaseDao<I, E extends BaseEntity<K>, K>
        implements Dao<I, E, K> {

    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(com.markcdunn.core.daos.BaseDao.class);

    private EntityManager entityManager;
    private Class<E> entityClass;
    private Search<I> search;

    protected BaseDao(Class<E> entityClass) {
        this.entityClass = entityClass;
    }

    protected BaseDao(Class<E> entityClass, Search<I> search) {
        this(entityClass);
        this.search = search;
    }

    /**
     * Setter and injection point for EntityManager.
     * 
     * @param em the EntityManager.
     */
    public void setEntityManager(EntityManager em) {
        this.entityManager = em;
    }

    /**
     * provides access to the EntityManager for this DAO.
     *
     * This allows search implementations to access the EntityManager directly.
     *
     * @return the EntityManager used by this DAO.
     */
    public EntityManager getEntityManager() {
        return entityManager;
    }

    /**
	 * 
	 */
    public void flush() {
        entityManager.flush();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public E newInstance() {
        return BaseEntity.newInstance(entityClass);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public E get(K id) {
        return entityManager.find(entityClass, id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<E> getAll(Collection<K> ids) {
        return null;
    }

    /**
     * {@inheritDoc}s
     */
    @Override
    public E update(E entity) {
        if ((entity.getTypedId() == null) || (get(entity.getTypedId()) == null)) {
            entityManager.persist(entity);
            entityManager.flush();
            return entity;
        }
        entity = entityManager.merge(entity);
        entityManager.flush();
        return entity;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<E> updateAll(Collection<E> data) {
        Collection<E> result = new ArrayList<E>(data.size());
        for (E entity : data) {
            result.add(updateNoFlush(entity));
        }
        entityManager.flush();
        return result;
    }

    @Override
    public E updateNoFlush(E entity) {
        if ((entity.getTypedId() == null) || (get(entity.getTypedId()) == null)) {
            entityManager.persist(entity);

            return entity;
        }
        entity = entityManager.merge(entity);

        return entity;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<E> updateAllNoFlush(Collection<E> data) {
        Collection<E> result = new ArrayList<E>(data.size());
        for (E entity : data) {
            result.add(updateNoFlush(entity));
        }
        return result;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean delete(E entity) {
        entityManager.remove(update(entity));
        entityManager.flush();
        return true;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAll(Collection<E> data) {
        for (E entity : data) {
            entityManager.remove(updateNoFlush(entity));
        }
        entityManager.flush();
        return true;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteNoFlush(E entity) {
        entityManager.remove(updateNoFlush(entity));
        entityManager.flush();
        return true;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAllNoFlush(Collection<E> data) {
        for (E entity : data) {
            entityManager.remove(updateNoFlush(entity));
        }
        return true;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<I> search(SearchCriteria<I> criteria) {
        return search.search(criteria);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<? extends SearchResult> search(SearchCriteria<I> criteria,
            Class<? extends SearchResult> searchResultClass) {
        return search.search(criteria, searchResultClass);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long count(SearchCriteria<I> criteria) {
        return search.count(criteria);
    }

    protected void setSearch(Search<I> search) {
        this.search = search;
    }
}
