package com.markcdunn.core.daos.search;

import com.markcdunn.core.utils.StatusEnum;

import java.util.ArrayList;
import java.util.List;

// TODO: check extending ServiceResponseImpl
public class SearchResultsImpl<T>
//        extends ServiceResponseImpl
        implements SearchResults<T> {

    private static final long serialVersionUID = 1L;
    
    protected long resultsCount;
    protected long totalCount;
    protected StatusEnum status = StatusEnum.SUCCESS;
    protected long offset;
    protected long maxItems;
    protected List<T> results = new ArrayList<T>();

    public SearchResultsImpl() {
    }

    public SearchResultsImpl(List<? extends T> results) {
        setResults(results);
    }

    public long getResultsCount() {
        return resultsCount;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public long getOffset() {
        return offset;
    }

    public void setOffset(long offset) {
        this.offset = offset;
    }

    public long getMaxItems() {
        return maxItems;
    }

    public void setMaxItems(long maxItems) {
        this.maxItems = maxItems;
    }

    public List<T> getResults() {
        return results;
    }

    public boolean isEmpty() {
        return results == null || results.isEmpty();
    }

    public void setResults(List<? extends T> results) {
        this.results = results != null ? new ArrayList<T>(results) : new ArrayList<T>();
        this.resultsCount = this.results.size();
    }

    public long getPage() {
        if (getMaxItems() == 0) {
            return 0;
        }
        return (getOffset() / getMaxItems()) + 1;
    }

    public long getPages() {
        if (getMaxItems() == 0) {
            return 0;
        }
        return (long) Math.ceil((double) getTotalCount() / getMaxItems());
    }

    @Override
    public String toString() {
        return "SearchResultsImpl{" + "resultsCount=" + resultsCount + ", totalCount=" + totalCount
                + ", totalPageCount=" + getPages() + ", offset=" + offset + ", maxItems=" + maxItems + ", results="
                + results + ", [" + super.toString() + "]" + "}";
    }
}
