package com.markcdunn.core.daos;

import com.markcdunn.core.utils.KeyValue;

import java.util.List;

// TODO: document this class correctly

public interface StoredProcedureDao<T> {

    public T newInstance();

    public T get(List<KeyValue<String, String>> params);

    public List<T> getResultSet( List<KeyValue<String, String>> params);
}
