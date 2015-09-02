package com.markcdunn.core.daos;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.StoredProcedureQuery;

import com.markcdunn.core.entities.BaseEntity;
import com.markcdunn.core.utils.KeyValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class BaseStoredProcedureDao<T extends BaseEntity<K>, K>
        implements StoredProcedureDao<T> {

    private static Logger log = LoggerFactory.getLogger(BaseStoredProcedureDao.class);

    private EntityManager entityManager;
    private Class<T> entityClass;
    private String procedureName;

    protected BaseStoredProcedureDao(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    protected BaseStoredProcedureDao(Class<T> entityClass, String procedureName) {
        this.entityClass = entityClass;
        this.procedureName = procedureName;
    }

    /**
     * Setter and injection point for EntityManager.
     * 
     * @param entityManager the EntityManager
     */
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public EntityManager getEntityManager() {
        return entityManager;
    }

    public String getProcedureName() {
        return procedureName;
    }

    public void setProcedureName(String procedureName) {
        this.procedureName = procedureName;
    }

    /**
     * {@inheritDoc}
     */
    protected void flushTransaction() {
        entityManager.flush();
    }

    
    /**
     * {@inheritDoc}
     */
    @Override
    public T newInstance() {
        return BaseEntity.newInstance(entityClass);
    }

    /**
     * {@inheritDoc}
     */
   @Override
    public T get(List<KeyValue<String,String>> params){
       
       StoredProcedureQuery spq= entityManager.createNamedStoredProcedureQuery(procedureName);
       for (KeyValue<String, String> parameter : params) {
           spq.setParameter(parameter.getKey(), parameter.getValue());
           
       }
       return (T) spq.getSingleResult();
    }

    /**
     * {@inheritDoc}
     */
//   @Override
   public List<T> GetResultSet( List<KeyValue<String, String>> params) {
       StoredProcedureQuery spq= entityManager.createNamedStoredProcedureQuery(procedureName);
       for (KeyValue<String, String> parameter : params) {
           spq.setParameter(parameter.getKey(), parameter.getValue());
           
       }
       return spq.getResultList();
   }

    /**
     * {@inheritDoc}
     */
//   @Override
   public T update(T data) {
       throw new UnsupportedOperationException("This method is not supported by BaseStoredProcedureDAO");
   }

    /**
     * {@inheritDoc}
     */
//   @Override
   public boolean delete(T data) {
       throw new UnsupportedOperationException("This method is not supported by BaseStoredProcedureDAO");
   }
}
