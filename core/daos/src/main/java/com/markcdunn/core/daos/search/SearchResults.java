package com.markcdunn.core.daos.search;

import java.io.Serializable;
import java.util.List;

/**
 * Wrapper for Search results which provides paging metadata.
 * 
 * @author gtassone
 *
 * @param <T>
 */
// TODO: investigate use of ServiceResponse
public interface SearchResults<T>
        extends Serializable {
//        extends ServiceResponse {

    /**
     * Get the results in List form
     * 
     * An empty list is returned for no results.
     * 
     * @return
     */
    public List<T> getResults();

    public long getTotalCount();

    public boolean isEmpty();

    public long getOffset();

    public long getResultsCount();

    public long getPage();

    public long getPages();

    public long getMaxItems();
}
