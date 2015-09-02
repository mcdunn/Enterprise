package com.markcdunn.core.utils;


import com.google.common.collect.ImmutableList;

import java.io.Serializable;
import java.util.List;

/**
 * An enumeration type representing the possible Message Types.
 */
public enum MessageTypeEnum
        implements Serializable, IntegerValuedEnum {
    /**
     * A success message.
     */
    SUCCESS(0, "Success"),

    /**
     * An error message.
     */
    ERROR(1, "Error"),

    /**
     * A warning message.
     */
    WARNING(2, "Warning"),

    /**
     * An information message.
     */
    INFO(3, "Info");


    /**
     * A unique identifier for enum value.
     */
    private final int id;

    /**
     * A textual label for the enum value.
     */
    private final String label;

    /**
     * A static list containing all elements from this enumeration.
     */
    private static final List<MessageTypeEnum> enumList = ImmutableList.copyOf(values());

    /**
     * A static list containing a KeyValue pair for all elements from this enumeration.
     */
    private static final List<KeyValue<String, String>> keyValueList;

    /**
     * Build the static KeyValue list
     */
    static {
        final ImmutableList.Builder<KeyValue<String, String>> builder = ImmutableList.builder();
        for (MessageTypeEnum enumeration : values()) {
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
    private MessageTypeEnum(int id, String label) {
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
     * Return <code>true</code> if this enumeration represents a success message, otherwise <code>false</code>.
     *
     * @return <code>true</code> if this enumeration represents a success message, otherwise <code>false</code>
     */
    public boolean isSuccess() {
        return (this == MessageTypeEnum.SUCCESS);
    }

    /**
     * Return <code>true</code> if this enumeration represents a error message, otherwise <code>false</code>.
     *
     * @return <code>true</code> if this enumeration represents a error message, otherwise <code>false</code>
     */
    public boolean isError() {
        return (this == MessageTypeEnum.ERROR);
    }

    /**
     * Return <code>true</code> if this enumeration represents a warning message, otherwise <code>false</code>.
     *
     * @return <code>true</code> if this enumeration represents a warning message, otherwise <code>false</code>
     */
    public boolean isWarning() {
        return (this == MessageTypeEnum.WARNING);
    }

    /**
     * Return <code>true</code> if this enumeration represents an info message, otherwise <code>false</code>.
     *
     * @return <code>true</code> if this enumeration represents an info message, otherwise <code>false</code>
     */
    public boolean isInfo() {
        return (this == MessageTypeEnum.INFO);
    }

    /**
     * Return the enum for the passed id or label.
     *
     * @param string String to match with an id or label.
     * @return Associated enum, or <code>null</code> if a match is not found.
     */
    public static MessageTypeEnum get(String string) {
        if (string == null) {
            return null;
        }
        try {
            Integer id = Integer.valueOf(string);
            MessageTypeEnum enumeration = getById(id);
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
    public static MessageTypeEnum getById(Integer id) {
        if (id == null) {
            return null;
        }
        for (MessageTypeEnum type : MessageTypeEnum.values()) {
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
    public static MessageTypeEnum getByLabel(String label) {
        for (MessageTypeEnum type : MessageTypeEnum.values()) {
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
}