package com.markcdunn.core.daos;

import com.markcdunn.core.daos.search.Search;

import java.util.Collection;

/**
 * Interface for DAO objects which can be used to perform CRUD operations for a particular data type.
 * 
 * @author gtassone
 *
 * @param <I> The entity interface used by the DAO.
 * @param <E> The entity used by the DAO.
 * @param <K> The data type of primary key for the entity.
 */
public interface Dao<I, E, K>
        extends Search<I> {

    public E newInstance();

    public E get(K id);
    
    public Collection<E> getAll(Collection<K> ids);

    public E update(E data);
    
    public Collection<E> updateAll(Collection<E> data);
    
    public E updateNoFlush(E data);
    
    public Collection<E> updateAllNoFlush(Collection<E> data);

    public boolean delete(E data);
    
    public boolean deleteAll(Collection<E> data);

    public boolean deleteNoFlush(E data);
    
    public boolean deleteAllNoFlush(Collection<E> data);

    public void flush();
}
