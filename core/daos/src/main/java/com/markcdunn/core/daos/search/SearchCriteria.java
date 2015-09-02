package com.markcdunn.core.daos.search;

import java.util.List;

/**
 * Criteria used to filter search results.
 * 
 * Typically these would be field-level constraints which can be translated into
 * dynamic database queries.
 * 
 * @author gtassone
 * 
 * @param <T>
 *            The searched type.
 */
public interface SearchCriteria<T> {
	
    SortOrderList getSortOrderList();

    void setSortOrder(String sortOrderString);

    void setSortOrder(String sortField, SortDirectionEnum sortDirection);

    void setSortOrder(SortOrder sortOrder);

    int getOffset();

    void setOffset(int offset);

    int getMaxItems();

    void setMaxItems(int maxItems);

    void setOffset(String offset);

    void setMaxItems(String maxItems);

    List<SortOrder> getDefaultSortOrder();

    public void setPerformCount(boolean performCount);

    public boolean getPerformCount();

    /**
     * Subclasses should override as needed. Provides ability to filter sort order prior to setting
     *
     * @param sortOrderString sortOrderString
     * @return List<SortOrder> list of SortOrder objects
     */
    List<SortOrder> processSortOrderString(String sortOrderString);
}
