package com.markcdunn.core.services;

import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SearchResult;
import com.markcdunn.core.daos.search.SearchResults;

/**
 * Interface for a search delegate object.
 * 
 * The separate Search interface allows different query implementations to be
 * used and injected into Composite DAOs.
 * 
 * @param <I>
 */
public interface SearchService<I> {

	public Long count(SearchCriteria<I> criteria)
            throws ServiceException;

	public SearchResults<I> search(SearchCriteria<I> criteria)
            throws ServiceException;

    public SearchResults<? extends SearchResult> search(SearchCriteria<I> criteria,
            Class<? extends SearchResult> searchResultClass)
            throws ServiceException;
}
