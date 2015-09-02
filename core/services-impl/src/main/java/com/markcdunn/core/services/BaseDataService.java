package com.markcdunn.core.services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.markcdunn.core.daos.Dao;
import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SearchResult;
import com.markcdunn.core.daos.search.SearchResults;
import com.markcdunn.core.model.Entity;
import com.markcdunn.core.model.Modification;
import com.markcdunn.core.model.ModificationType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Base implementation for DataServices.
 * 
 * This implementation assumes that for a given DataService interface and data type (I), a corresponding implementation
 * data type (E, typically a JPA Entity) is used by a DAO.
 * 
 * @author gtassone
 * 
 * @param <I> Entity Interface
 * @param <E> Entity Implementation
 * @param <K> Entity Key
 */
public abstract class BaseDataService<I extends Entity, E extends I, K>
        implements DataService<I, K> {

    @SuppressWarnings("unused")
    private Logger log = LoggerFactory.getLogger(BaseDataService.class);

    private Dao<I, E, K> dao;
    private Class<E> clazz;

    protected BaseDataService(Class<E> clazz) {
        this.clazz = clazz;
    }

    /**
     * Setter and injection point for DAO.
     * 
     * @param dao DAO
     */
    protected void setDao(Dao<I, E, K> dao) {
        this.dao = dao;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public I newInstance() {
        return dao.newInstance();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public I get(K key) {
        return dao.get(key);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<I> getAll(Collection<K> keys) {
        // TODO: fix this unchecked warning
        return (Collection<I>) dao.getAll(keys);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<I> search(SearchCriteria<I> criteria)
            throws ServiceException {
        return dao.search(criteria);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<? extends SearchResult> search(SearchCriteria<I> criteria,
            Class<? extends SearchResult> searchResultClass)
            throws ServiceException {
        return dao.search(criteria, searchResultClass);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long count(SearchCriteria<I> criteria)
            throws ServiceException {
        return dao.search(criteria).getTotalCount();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public I create(I entity)
            throws ServiceException {
        if (!(clazz.isInstance(entity))) {
            throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                    + entity.getClass().getName() + "expected " + clazz.getClass().getName());
        }
        generateNewId(entity);
        return update(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public I createNoFlush(I entity)
            throws ServiceException {
        if (!(clazz.isInstance(entity))) {
            throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                    + entity.getClass().getName() + "expected " + clazz.getClass().getName());
        }
        generateNewId(entity);
        return updateNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public I update(I entity)
            throws ServiceException {
        if (!(clazz.isInstance(entity))) {
            throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                    + entity.getClass().getName() + "expected " + clazz.getClass().getName());
        }
        return dao.update((E) entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public I updateNoFlush(I entity)
            throws ServiceException {
        if (!(clazz.isInstance(entity))) {
            throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                    + entity.getClass().getName() + "expected " + clazz.getClass().getName());
        }
        return dao.updateNoFlush((E) entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public Collection<I> updateAll(Collection<I> entities)
            throws ServiceException {
        for (I entity : entities) {
            if (!(clazz.isInstance(entity))) {
                throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                        + entity.getClass().getName() + "expected " + clazz.getClass().getName());
            }
        }
        return (Collection<I>) dao.updateAll((Collection<E>) entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public Collection<I> updateAllNoFlush(Collection<I> entities)
            throws ServiceException {
        for (I entity : entities) {
            if (!(clazz.isInstance(entity))) {
                throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                        + entity.getClass().getName() + "expected " + clazz.getClass().getName());
            }
        }
        return (Collection<I>) dao.updateAllNoFlush((Collection<E>) entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public boolean delete(I entity)
            throws ServiceException {
        if (!(clazz.isInstance(entity))) {
            throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                    + entity.getClass().getName() + "expected " + clazz.getClass().getName());
        }
        return dao.delete((E) entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public boolean deleteNoFlush(I entity)
            throws ServiceException {
        if (!(clazz.isInstance(entity))) {
            throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                    + entity.getClass().getName() + "expected " + clazz.getClass().getName());
        }
        return dao.deleteNoFlush((E) entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public boolean deleteAll(Collection<I> entities) throws ServiceException {
        for (I entity : entities) {
            if (!(clazz.isInstance(entity))) {
                throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                        + entity.getClass().getName() + "expected " + clazz.getClass().getName());
            }
        }
        return dao.deleteAll((Collection<E>) entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("unchecked") // Manually checking types before casting
    public boolean deleteAllNoFlush(Collection<I> entities) throws ServiceException {
        for (I entity : entities) {
            if (!(clazz.isInstance(entity))) {
                throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                        + entity.getClass().getName() + "expected " + clazz.getClass().getName());
            }
        }
        return dao.deleteAllNoFlush((Collection<E>) entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<I> applyModifications(Collection<Modification<I>> modifications)
            throws ServiceException {

        for (Modification<I> modification : modifications) {
            if (!(clazz.isInstance(modification.getEntity()))) {
                throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                        + modification.getEntity().getClass().getName() + "expected " + clazz.getClass().getName());
            }
        }

        List<I> entities = new ArrayList<>();
        for (Modification<I> modification : modifications) {
            if (modification.getType() == ModificationType.CREATE) {
                entities.add(create(modification.getEntity()));
            }
            if (modification.getType() == ModificationType.UPDATE) {
                entities.add(updateNoFlush(modification.getEntity()));
            }
            if (modification.getType() == ModificationType.DELETE) {
                deleteNoFlush(modification.getEntity());
            }
        }
        dao.flush();
        return entities;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void generateNewId(I entity) {
        // Do nothing by default, some entities will have IDs generated by JPA using database sequences or guid generators
    }

}
