package com.markcdunn.core.utils;

public enum SortDirectionEnum {

    ASC(1, "Ascending", "ASC"),
    DESC(-1, "Descending", "DESC");

    private final int id;
    private final String label;
    private final String shortName;

    private SortDirectionEnum( int id, String label, String shortName) {
        this.id = id;
        this.label = label;
        this.shortName = shortName;
    }

    public int getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public static SortDirectionEnum getSortDirectionEnum(final int id) {
        for (SortDirectionEnum dir : SortDirectionEnum.values()) {
            if (dir.id == id) {
                return dir;
            }
        }
        return null;
    }

    public static SortDirectionEnum getSortDirectionEnum(final String value) {
        if (value != null) {
            for (SortDirectionEnum dir : SortDirectionEnum.values()) {
                if (dir.label.equalsIgnoreCase(value)) {
                    return dir;
                }
            }
        }
        if (value != null) {
            for (SortDirectionEnum dir : SortDirectionEnum.values()) {
                if (dir.shortName.equalsIgnoreCase(value)) {
                    return dir;
                }
            }
        }
        return null;
    }
}
