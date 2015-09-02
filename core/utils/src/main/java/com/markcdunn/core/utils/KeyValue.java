package com.markcdunn.core.utils;

import java.io.Serializable;

/**
 * An interface describing a key/value mapping for the implementing object.  An implementing object should
 *   ensure that the result of a call to {@link com.markcdunn.core.utils.KeyValue#getKey()} should uniquely identify
 *   the matching result of {@link com.markcdunn.core.utils.KeyValue#getValue()}.
 * <br>
 * <br>
 * A key-to-value mapping is useful when working with hashes of data, or in users-interface objects such as select and
 *   check boxes.
 *
 * @param <K> Data type of the key field.
 * @param <V> Data type of the value field.
 */
public interface KeyValue<K, V>
        extends Serializable {
    /**
     * A key - uniquely identifying the paired value.
     *
     * @return  The key.
     */
    public K getKey();

    /**
     * A value corresponding to the key.
     *
     * @return  The value.
     */
    public V getValue();
}