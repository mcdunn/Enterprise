package com.markcdunn.whatever.spring;

import com.markcdunn.core.daos.Dao;
import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SearchResults;
import com.markcdunn.core.services.ServiceException;
import com.markcdunn.whatever.entities.WhateverEntity;
import com.markcdunn.whatever.model.Whatever;
import com.markcdunn.whatever.services.WhateverDataService;
import com.markcdunn.core.model.Modification;
import com.markcdunn.whatever.services.impl.WhateverDataServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service("whateverDataService")
@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
public class WhateverDataServiceSpring
        extends WhateverDataServiceImpl
        implements WhateverDataService {

    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(WhateverDataServiceSpring.class);

    @Autowired
    @Qualifier("whateverDao")
    public void setWhateverDao(Dao<Whatever, WhateverEntity, String> whateverDao) {
        super.setDao(whateverDao);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Whatever newInstance() {
        return super.newInstance();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public Whatever get(String id) {
        return super.get(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public Collection<Whatever> getAll(Collection<String> keys) {
        return super.getAll(keys);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public SearchResults<Whatever> search(SearchCriteria<Whatever> criteria)
            throws ServiceException {
        return super.search(criteria);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public Long count(SearchCriteria<Whatever> criteria)
            throws ServiceException {
        return super.search(criteria).getTotalCount();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Whatever create(Whatever entity)
            throws ServiceException {
        return super.create(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Whatever createNoFlush(Whatever entity)
            throws ServiceException {
        return super.createNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Whatever update(Whatever entity)
            throws ServiceException {
        return super.update(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Whatever updateNoFlush(Whatever entity)
            throws ServiceException {
        return super.updateNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<Whatever> updateAll(Collection<Whatever> entities)
            throws ServiceException {
        return super.updateAll(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<Whatever> updateAllNoFlush(Collection<Whatever> entities)
            throws ServiceException {
        return super.updateAllNoFlush(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean delete(Whatever entity)
            throws ServiceException {
        return super.delete(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteNoFlush(Whatever entity)
            throws ServiceException {
        return super.deleteNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAll(Collection<Whatever> entities)
            throws ServiceException {
        return super.deleteAll(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAllNoFlush(Collection<Whatever> entities)
            throws ServiceException {
        return super.deleteAllNoFlush(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<Whatever> applyModifications(Collection<Modification<Whatever>> modifications)
            throws ServiceException {
        return super.applyModifications(modifications);
    }
}
