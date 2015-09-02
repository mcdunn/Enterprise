package com.markcdunn.core.utils;

import java.io.Serializable;

public interface IntegerValuedEnum
        extends Serializable {

    /**
     * Current integer value stored in the enum.
     *
     * @return integer value.
     */
    public int getId();
}
