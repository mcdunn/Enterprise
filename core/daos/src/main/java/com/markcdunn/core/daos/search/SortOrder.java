package com.markcdunn.core.daos.search;

public class SortOrder {

    private String sortField;
    private SortDirectionEnum sortDirection;


    public SortOrder(String sortField, SortDirectionEnum sortDirection) {
        this.sortField = sortField;
        this.sortDirection = sortDirection;
    }
    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public String getSortField() {
        return sortField;
    }

    public void setSortDirection(SortDirectionEnum sortDirection) {
        this.sortDirection = sortDirection;
    }

    public SortDirectionEnum getSortDirection() {
        return sortDirection;
    }

    public boolean equals(Object obj) {
        if (!(obj instanceof SortOrder)) {
            return false;
        }

        SortOrder sortOrder = (SortOrder)obj;
        if (!sortOrder.getSortField().equals(this.getSortField()) ||
                !sortOrder.getSortDirection().equals(this.getSortDirection())) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "SortOrder{" +
                "sortField=" + sortField +
                ", sortDirection=" + sortDirection +
                '}';
    }
}
