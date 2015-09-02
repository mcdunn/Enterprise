package com.markcdunn.core.services;


import com.markcdunn.core.daos.StoredProcedureDao;
import com.markcdunn.core.utils.KeyValue;

import java.util.ArrayList;
import java.util.List;

public abstract class BaseDataServiceStoredProcedure<I, E extends I, K>
        implements StoredProcedureDataService<I>  {

    private StoredProcedureDao<E> dao;

    protected BaseDataServiceStoredProcedure() {
    }

    /**
     * Setter and injection point for DAO.
     * 
     * @param dao DAO
     */
    protected void setDao(StoredProcedureDao<E> dao) {
        this.dao = dao;
    }

    public I newInstance() {
        return dao.newInstance();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public I get(List<KeyValue<String, String>> params) {
        return dao.get(params);
    }


    /**
     * {@inheritDoc}
     */
    @Override
    public List<I> GetResultSet(List<KeyValue<String, String>> params) {
        List<I> finalResults = new ArrayList<>();
        List<? extends I> results = dao.getResultSet(params);
        for (I object : results) {
            finalResults.add(object);
        }
        return finalResults;
    }

    /**
     * {@inheritDoc}
     */
/*    @Override
    public I update(I data) throws ServiceException {
        if (!(clazz.isInstance(data))) {
            throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                    + data.getClass().getName() + "\nuse Service.newInstance() to obtain Service objects");
        }
        return dao.update((E) data);
    }*/

    /**
     * {@inheritDoc}
     */
/*    @Override
    public boolean delete(I data) {
        if (!(clazz.isInstance(data))) {
            throw new IllegalArgumentException("The submitted object is of the wrong implementation type: "
                    + data.getClass().getName() + "\nuse Service.newInstance() to obtain Service objects");
        }
        return dao.delete((E) data);
    }*/
}
