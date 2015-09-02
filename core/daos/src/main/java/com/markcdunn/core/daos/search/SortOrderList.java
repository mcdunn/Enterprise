package com.markcdunn.core.daos.search;

import java.util.ArrayList;

public class SortOrderList extends ArrayList<SortOrder> {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
    public boolean equals(Object obj) {

        if (!(obj instanceof SortOrderList)) {
            return false;
        }
        SortOrderList sortOrderList = (SortOrderList)obj;
        if (this.size() != sortOrderList.size()) {
            return false;
        }

        for (int i = 0; i < size(); i++) {
            if (!sortOrderList.get(i).equals(this.get(i))) {
                return false;
            }
        }
        return true;
    }
}
