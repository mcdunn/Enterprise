package com.markcdunn.core.daos.search;

public interface SearchResult<E> {
    public SearchResult<E> newInstance(E entity);
}
