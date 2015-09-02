package com.markcdunn.core.model;

import com.google.common.collect.ImmutableList;
import com.markcdunn.core.utils.KeyValue;
import com.markcdunn.core.utils.StringKeyValue;
import com.markcdunn.core.utils.StringValuedEnum;

import java.util.List;

public enum ModificationType
        implements StringValuedEnum {

    CREATE("CREATE", "Create"),
    UPDATE("UPDATE", "Update"),
    DELETE("DELETE", "Delete");

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
    private static final List<ModificationType> enumList = ImmutableList.copyOf(values());

    /**
     * A static list containing a KeyValue pair for all elements from this enumeration.
     */
    private static final List<KeyValue<String, String>> keyValueList;

    /**
     * Build the statKeyValue list
     */
    static {
        final ImmutableList.Builder<KeyValue<String, String>> builder = ImmutableList.builder();
        for (ModificationType enumeration : values()) {
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
    private ModificationType(String id, String label) {
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
    public static ModificationType get(String string) {
        if (string == null) {
            return null;
        }
        try {
            ModificationType enumeration = getById(string);
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
    public static ModificationType getById(String id) {
        if (id == null) {
            return null;
        }
        for (ModificationType type : ModificationType.values()) {
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
    public static ModificationType getByLabel(String label) {
        for (ModificationType type : ModificationType.values()) {
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
    public static List<ModificationType> getAllEnums() {
        return enumList;
    }
}
