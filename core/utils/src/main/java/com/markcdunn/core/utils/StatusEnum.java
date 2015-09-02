package com.markcdunn.core.utils;


import com.google.common.collect.ImmutableList;

import java.io.Serializable;
import java.util.List;

/**
 * An enumeration type representing the possible Statuses.
 */
public enum StatusEnum
        implements Serializable, IntegerValuedEnum {
    /**
     * A success.
     */
    SUCCESS(0, "Success"),

    /**
     * A failure.
     */
    FAILURE(1, "Failure");

    /**
     * A unique identifier for enum value
     */
    private final int id;

    /**
     * A textual label for the enum value
     */
    private final String label;

    /**
     * A static list containing all elements from this enumeration.
     */
    private static final List<StatusEnum> enumList = ImmutableList.copyOf(values());

    /**
     * A static list containing a KeyValue pair for all elements from this enumeration.
     */
    private static final List<KeyValue<String, String>> keyValueList;

    /**
     * Build the statKeyValue list
     */
    static {
        final ImmutableList.Builder<KeyValue<String, String>> builder = ImmutableList.builder();
        for (StatusEnum enumeration : values()) {
            builder.add(enumeration.getKeyValue());
        }
        keyValueList = builder.build();
    }

    /**
     * Default constructor.
     *
     * @param id    Type's id value.
     * @param label Type's label value.
     */
    private StatusEnum(int id, String label) {
        this.id = id;
        this.label = label;
    }

    /**
     * Return the id associated with this enumeration type.
     *
     * @return The id associated with this enumeration type.
     */
    public int getId() {
        return this.id;
    }

    /**
     * Return the label String associated with this enumeration type.
     *
     * @return The label String associated with this enumeration type.
     */
    public String getLabel() {
        return this.label;
    }

    /**
     * Return a KeyValue representing this enumeration type.
     *
     * @return The label String associated with this enumeration type.
     */
    public KeyValue<String, String> getKeyValue() {
        return new StringKeyValue(String.valueOf(getId()), getLabel());
    }

    /**
     * Return <code>true</code> if this enumeration represents a success.
     *
     * @return <code>true</code> if this enumeration represents a success, otherwise<code>false</code>
     */
    public boolean isSuccess() {
        return (this == StatusEnum.SUCCESS);
    }

    /**
     * Return <code>true</code> if this enumeration represents a failure.
     *
     * @return <code>true</code> if this enumeration represents a failure, otherwise<code>false</code>
     */
    public boolean isFailure() {
        return (this == StatusEnum.FAILURE);
    }

    /**
     * Return the enum for the passed id or label.
     *
     * @param string String to match with an id or label.
     * @return Associated enum, or <code>null</code> if a match is not found.
     */
    public static StatusEnum get(String string) {
        if (string == null) {
            return null;
        }
        try {
            Integer id = Integer.valueOf(string);
            StatusEnum enumeration = getById(id);
            if (enumeration != null) {
                return enumeration;
            }
        }
        catch (Exception e) {
            // ignore
        }
        return getByLabel(string);
    }

    /**
     * Return the enum for the passed id.
     *
     * @param id Id value.
     * @return Associated enum, or <code>null</code> if the id value is not found.
     */
    public static StatusEnum getById(Integer id) {
        if (id == null) {
            return null;
        }
        for (StatusEnum type : StatusEnum.values()) {
            if (type.id == id) {
                return type;
            }
        }
        return null;
    }

    /**
     * Return the enum for the passed label.
     *
     * @param label Label value.
     * @return Associated enum, or <code>null</code> if the label value is not found.
     */
    public static StatusEnum getByLabel(String label) {
        for (StatusEnum type : StatusEnum.values()) {
            if (type.label.equalsIgnoreCase(label)) {
                return type;
            }
        }
        return null;
    }

    /**
     * Return a list of key value (String) pairs for all enum objects.
     *
     * @return List of key value (String) pairs for all enum objects
     */
    public static List<KeyValue<String, String>> getAllKeyValues() {
        return keyValueList;
    }

    /**
     * Return a list of all enum objects.
     *
     * @return List of all enum objects
     */
    public static List<StatusEnum> getAllEnums() {
        return enumList;
    }
}