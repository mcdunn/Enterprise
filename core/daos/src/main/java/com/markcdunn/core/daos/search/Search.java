package com.markcdunn.core.daos.search;

/**
 * Interface for a search delegate object.
 * 
 * The separate Search interface allows different query implementations to be
 * used and injected into Composite DAOs.
 * 
 * @param <I>
 */
public interface Search<I> {

	public Long count(SearchCriteria<I> criteria);

	public SearchResults<I> search(SearchCriteria<I> criteria);

    public SearchResults<? extends SearchResult> search(SearchCriteria<I> criteria,
            Class<? extends SearchResult> searchResultClass);
}
