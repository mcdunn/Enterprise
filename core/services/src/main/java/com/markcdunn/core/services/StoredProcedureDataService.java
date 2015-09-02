package com.markcdunn.core.services;

import com.markcdunn.core.utils.KeyValue;

import java.util.List;

/**
 * The generic data service interface.
 *
 * This interface provides CRUD operations for a given Data type at the service layer.
 *
 * @param <I> The data type supported by the service.
 */

// TODO: clean this up

public interface StoredProcedureDataService<I> {


    /**
     * Factory method to create a new instance of the data type.
     *
     * The instance is not persisted until {@link DataService#update()} is called.
     *
     * @return a new instance.
     */
//    I newInstance() throws ServiceException;

    /**
     * Executes the stored procedure and captures the return value.
     *
     * @param params the params of the stored procedure
     * @return the results of the stored procedure call
     */
    public I get(List<KeyValue<String, String>> params) throws ServiceException;

    /**
     * Executes the stored procedure and captures the return values.
     *
     * @param params the params of the stored procedure
     * @return the results of the stored procedure call
     */
    public List<I> GetResultSet(List<KeyValue<String, String>> params);

    /**
     * Persists the data item, updating the existing record as necessary.
     *
     * @param data the updated data item.
     * @return the updated data item, once it has been persisted.
     */
//    public I update(I data) throws ServiceException;

    /**
     * Removes the persistent record for the given data item.
     *
     * @param data the data item to remove.
     * @return true if successful, false otherwise.
     */
//    public boolean delete(I data) throws ServiceException;
}
