package com.markcdunn.users.spring;

import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SearchResult;
import com.markcdunn.core.daos.search.SearchResults;
import com.markcdunn.users.daos.UserDao;
import com.markcdunn.users.entities.UserEntity;
import com.markcdunn.users.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collection;

@Repository("userDao")
@Transactional(propagation = Propagation.MANDATORY, readOnly = false)
public class UserDaoSpring
        extends UserDao {

    @Autowired
    @Qualifier("userQueryDslSearch")
    public void setSearch(UserSearchSpring userSearch) {
        super.setSearch(userSearch);
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
    public UserEntity get(String id) {
        return super.get(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<UserEntity> getAll(Collection<String> ids) {
        return null;
    }

    /**
     * {@inheritDoc}s
     */
    @Override
    public UserEntity update(UserEntity entity) {
        return super.update(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UserEntity updateNoFlush(UserEntity entity) {
        return super.updateNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<UserEntity> updateAll(Collection<UserEntity> entities) {
        return super.updateAll(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<UserEntity> updateAllNoFlush(Collection<UserEntity> entities) {
        return super.updateAllNoFlush(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean delete(UserEntity entity) {
        return super.delete(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteNoFlush(UserEntity entity) {
        return super.deleteNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAll(Collection<UserEntity> entities) {
        return super.deleteAll(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAllNoFlush(Collection<UserEntity> entities) {
        return super.deleteAllNoFlush(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<User> search(SearchCriteria<User> criteria) {
        return super.search(criteria);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public SearchResults<? extends SearchResult> search(SearchCriteria<User> criteria,
            Class<? extends SearchResult> searchResultClass) {
        return super.search(criteria, searchResultClass);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Long count(SearchCriteria<User> criteria) {
        return super.count(criteria);
    }
}
