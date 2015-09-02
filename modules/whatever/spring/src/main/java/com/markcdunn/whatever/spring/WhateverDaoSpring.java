package com.markcdunn.whatever.spring;

import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SearchResult;
import com.markcdunn.core.daos.search.SearchResults;
import com.markcdunn.whatever.daos.WhateverDao;
import com.markcdunn.whatever.entities.WhateverEntity;
import com.markcdunn.whatever.model.Whatever;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collection;

@Repository("whateverDao")
@Transactional(propagation = Propagation.MANDATORY, readOnly = false)
public class WhateverDaoSpring
        extends WhateverDao {

    @Autowired
    @Qualifier("whateverQueryDslSearch")
    public void setSearch(WhateverSearchSpring whateverSearch) {
        super.setSearch(whateverSearch);
    }

    @PersistenceContext(unitName="entityManagerFactory")
    @Override
    public void setEntityManager(EntityManager em) {
        super.setEntityManager(em);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void flush() {
        super.flush();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public WhateverEntity get(String id) {
        return super.get(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<WhateverEntity> getAll(Collection<String> ids) {
        return null;
    }

    /**
     * {@inheritDoc}s
     */
    @Override
    public WhateverEntity update(WhateverEntity entity) {
        return super.update(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public WhateverEntity updateNoFlush(WhateverEntity entity) {
        return super.updateNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<WhateverEntity> updateAll(Collection<WhateverEntity> entities) {
        return super.updateAll(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<WhateverEntity> updateAllNoFlush(Collection<WhateverEntity> entities) {
        return super.updateAllNoFlush(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean delete(WhateverEntity entity) {
        return super.delete(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteNoFlush(WhateverEntity entity) {
        return super.deleteNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAll(Collection<WhateverEntity> entities) {
        return super.deleteAll(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAllNoFlush(Collection<WhateverEntity> entities) {
        return super.deleteAllNoFlush(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<Whatever> search(SearchCriteria<Whatever> criteria) {
        return super.search(criteria);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<? extends SearchResult> search(SearchCriteria<Whatever> criteria,
            Class<? extends SearchResult> searchResultClass) {
        return super.search(criteria, searchResultClass);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long count(SearchCriteria<Whatever> criteria) {
        return super.count(criteria);
    }
}
