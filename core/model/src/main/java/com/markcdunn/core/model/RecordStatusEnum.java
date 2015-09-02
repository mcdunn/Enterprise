package com.markcdunn.core.model;

import com.google.common.collect.ImmutableList;
import com.markcdunn.core.utils.IntegerValuedEnum;
import com.markcdunn.core.utils.KeyValue;
import com.markcdunn.core.utils.StringKeyValue;

import java.io.Serializable;
import java.util.List;

/**
 * An enumeration type representing the possible Record Statuses.
 */
public enum RecordStatusEnum
        implements Serializable, IntegerValuedEnum {
    /**
     * A deleted (or inactive) data object.
     */
    DELETED(0, "Deleted"),

    /**
     * An active data object.
     */
    ACTIVE(1, "Active"),

    /**
     * Record status is unknown.
     */
    UNKNOWN(-1, "Unknown");

    /**
     * A unique identifier for record status.
     */
    private final int id;

    /**
     * Textual record status label.
     */
    private final String label;

    /**
     * A static list containing all elements from this enumeration.
     */
    private static final List<RecordStatusEnum> enumList = ImmutableList.copyOf(values());
    private static final List<KeyValue<String, String>> keyValueList;

    static {

        final ImmutableList.Builder<KeyValue<String, String>> builder = ImmutableList.builder();
        for (RecordStatusEnum recordStatusEnum : values()) {
            builder.add(recordStatusEnum.getKeyValue());
        }
        keyValueList = builder.build();
    }

    /**
     * Default constructor.
     *
     * @param id    Type's id value.
     * @param label Type's label value.
     */
    private RecordStatusEnum(int id, String label) {
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
     * Return a key value pair associated with this enumeration type.
     *
     * @return The key value pair associated with this enumeration type.
     */
    public KeyValue<String, String> getKeyValue() {
        return new StringKeyValue(String.valueOf(getId()), getLabel());
    }

    /**
     * Return <code>true</code> if this enumeration represents an active record.
     *
     * @return active indicator
     */
    public boolean isActive() {
        return (this == RecordStatusEnum.ACTIVE);
    }

    /**
     * Return <code>true</code> if this enumeration represents an deleted record.
     *
     * @return deleted indicator
     */
    public boolean isDeleted() {
        return (this == RecordStatusEnum.DELETED);
    }

    /**
     * Return the enum for the passed id or label.
     *
     * @param string String to match with an id or label.
     * @return Associated enum, or <code>null</code> if a match is not found.
     */
    public static RecordStatusEnum get(String string) {
        if (string == null) {
            return null;
        }
        try {
            Integer id = Integer.valueOf(string);
            RecordStatusEnum enumeration = getById(id);
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
    public static RecordStatusEnum getById(Integer id) {
        if (id == null) {
            return null;
        }
        for (RecordStatusEnum type : RecordStatusEnum.values()) {
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
    public static RecordStatusEnum getByLabel(String label) {
        for (RecordStatusEnum type : RecordStatusEnum.values()) {
            if (type.label.equalsIgnoreCase(label)) {
                return type;
            }
        }
        return null;
    }

    /**
     * Return a list of all enum objects.
     *
     * @return List of all enum objects
     */
    public static List<RecordStatusEnum> getAllEnums() {
        return enumList;
    }

    /**
     * Return a list of key value (String) pairs for all enum objects.
     *
     * @return List of key value (String) pairs for all enum objects
     */
    public static List<KeyValue<String, String>> getAllKeyValues() {
        return keyValueList;
    }
}