package com.markcdunn.core.utils;

/**
 * A string-based implementation of the {@link com.markcdunn.core.utils.KeyValue} interface.
 * <br>
 * <br>
 * The users of this object should ensure that the result of a call to {@link com.markcdunn.core.utils.KeyValue#getKey()}
 * uniquely identifies the matching result of {@link com.markcdunn.core.utils.KeyValue#getValue()}.
 */
public class StringKeyValue
        implements KeyValue<String, String>, Comparable {

    private String key;
    private String value;

    /**
     * Default Constructor.
     */
    public StringKeyValue() {
    }

    /**
     * Constructor.
     *
     * @param k  Initialize internal key to the passed value.
     * @param v  Initialize internal value to the passed value.
     */
    public StringKeyValue(String k, String v) {
        this.key = k;
        this.value = v;
    }

    /**
     * Return the key.
     *
     * @return The key.
     */
    public String getKey() {
        return this.key;
    }

    /**
     * Set the key value.
     *
     * @param key  Value to set as key.
     */
    public void setKey(String key) {
        this.key = key;
    }

    /**
     * Return the value.
     *
     * @return The value.
     */
    public String getValue() {
        return this.value;
    }

    /**
     * Set the "value" field value.
     *
     * @param value Value to set as "value" field.
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * (@inheritDoc)
     */
    public int compareTo(Object other) {
        if (other == null) {
            return 1;
        }

        if (other instanceof StringKeyValue) {
            StringKeyValue otherKeyValue = (StringKeyValue) other;
            if (otherKeyValue.getValue() == null) {
                return 1;
            }
            if (getValue() == null) {
                return -1;
            }
            return getValue().compareTo(otherKeyValue.getValue());
        }
        return -1;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if ((o == null) || (getClass() != o.getClass())) {
            return false;
        }

        StringKeyValue that = (StringKeyValue) o;

        if (key != null ? !key.equals(that.key) : that.key != null) {
            return false;
        }
        if (value != null ? !value.equals(that.value) : that.value != null) {
            return false;
        }

        return true;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int result = key != null ? key.hashCode() : 0;
        result = 31 * result + (value != null ? value.hashCode() : 0);
        return result;
    }
}