package com.markcdunn.core.services;

import com.google.common.collect.ImmutableList;
import com.markcdunn.core.utils.KeyValue;
import com.markcdunn.core.utils.StringKeyValue;
import com.markcdunn.core.utils.StringValuedEnum;

import java.util.List;

public enum ServiceExceptionType
        implements StringValuedEnum {

    SECURITY("SECURITY", "Access Denied"),
    ILLEGAL_ARGUMENT("ILLEGAL_ARGUMENT", "Illegal Argument"),
    PERSISTENCE("PERSISTENCE", "Database Error"),
    DUPLICATE("DUPLICATE", "Duplicate Record"),
    NOT_FOUND("NOT_FOUND", "Record not Found"),
    UNKNOWN("UNKNOWN", "Unknown Error");

    /**
     * A unique identifier for enum value
     */
    private final String id;

    /**
     * A textual label for the enum value
     */
    private final String label;

    /**
     * A static list containing all elements from this enumeration.
     */
    private static final List<ServiceExceptionType> enumList = ImmutableList.copyOf(values());

    /**
     * A static list containing a KeyValue pair for all elements from this enumeration.
     */
    private static final List<KeyValue<String, String>> keyValueList;

    /**
     * Build the statKeyValue list
     */
    static {
        final ImmutableList.Builder<KeyValue<String, String>> builder = ImmutableList.builder();
        for (ServiceExceptionType enumeration : values()) {
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
    private ServiceExceptionType(String id, String label) {
        this.id = id;
        this.label = label;
    }

    /**
     * Return the id associated with this enumeration type.
     *
     * @return The id associated with this enumeration type.
     */
    public String getId() {
        return this.id;
    }

    /**
     * Return the label associated with this enumeration type.
     *
     * @return The label associated with this enumeration type.
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
     * Return the enum for the passed id or label.
     *
     * @param string String to match with an id or label.
     * @return Associated enum, or <code>null</code> if a match is not found.
     */
    public static ServiceExceptionType get(String string) {
        if (string == null) {
            return null;
        }
        try {
            ServiceExceptionType enumeration = getById(string);
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
    public static ServiceExceptionType getById(String id) {
        if (id == null) {
            return null;
        }
        for (ServiceExceptionType type : ServiceExceptionType.values()) {
            if (type.id.equals(id)) {
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
    public static ServiceExceptionType getByLabel(String label) {
        for (ServiceExceptionType type : ServiceExceptionType.values()) {
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
    public static List<ServiceExceptionType> getAllEnums() {
        return enumList;
    }
}
