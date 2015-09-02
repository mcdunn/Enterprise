package com.markcdunn.users.spring;

import com.markcdunn.core.daos.Dao;
import com.markcdunn.core.daos.search.SearchCriteria;
import com.markcdunn.core.daos.search.SearchResults;
import com.markcdunn.core.services.ServiceException;
import com.markcdunn.users.entities.UserEntity;
import com.markcdunn.users.model.User;
import com.markcdunn.users.services.UserDataService;
import com.markcdunn.users.services.impl.UserDataServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Service("userDataService")
@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
public class UserDataServiceSpring
        extends UserDataServiceImpl
        implements UserDataService {

    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(UserDataServiceSpring.class);

    @Autowired
    @Qualifier("userDao")
    public void setUserDao(Dao<User, UserEntity, String> userDao) {
        super.setDao(userDao);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public User newInstance() {
        return super.newInstance();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public User get(String id) {
        return super.get(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public Collection<User> getAll(Collection<String> keys) {
        return super.getAll(keys);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public SearchResults<User> search(SearchCriteria<User> criteria)
            throws ServiceException {
        return super.search(criteria);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public Long count(SearchCriteria<User> criteria)
            throws ServiceException {
        return super.search(criteria).getTotalCount();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public User update(User entity)
            throws ServiceException {
        return super.update(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public User updateNoFlush(User entity)
            throws ServiceException {
        return super.updateNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<User> updateAll(Collection<User> entities)
            throws ServiceException {
        return super.updateAll(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Collection<User> updateAllNoFlush(Collection<User> entities)
            throws ServiceException {
        return super.updateAllNoFlush(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean delete(User entity)
            throws ServiceException {
        return super.delete(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteNoFlush(User entity)
            throws ServiceException {
        return super.deleteNoFlush(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAll(Collection<User> entities)
            throws ServiceException {
        return super.deleteAll(entities);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean deleteAllNoFlush(Collection<User> entities)
            throws ServiceException {
        return super.deleteAllNoFlush(entities);
    }
}
