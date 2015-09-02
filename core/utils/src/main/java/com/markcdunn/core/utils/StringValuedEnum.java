package com.markcdunn.core.utils;

import java.io.Serializable;

public interface StringValuedEnum
        extends Serializable {

    /**
     * Current String value stored in the enum.
     *
     * @return string value.
     */
    public String getId();
}
