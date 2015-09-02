package com.markcdunn.core.spring.transaction_manager;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.DefaultTransactionStatus;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import javax.persistence.EntityManagerFactory;

public class CustomJpaTransactionManager
        extends JpaTransactionManager {

    Logger log = LoggerFactory.getLogger(CustomJpaTransactionManager.class);
    /*
    @Autowired
    private EventService eventService;

    @Autowired
    private SystemConfigurationService systemConfigurationService;

    @Autowired
    private ProducerTemplate camelTemplate;

    private static final Log log = LogFactory.getLog(CustomJpaTransactionManager.class);
*/
    @Override
    public void setEntityManagerFactory(EntityManagerFactory entityManagerFactory) {
        super.setEntityManagerFactory(entityManagerFactory);
    }

    @Override
    protected void doBegin(Object transaction, TransactionDefinition definition) {
        String transactionId = definition.getName();
        log.debug("doBegin: transaction definition is: " + transactionId + ", " + definition);
        super.doBegin(transaction, definition);
    }

    @Override
    protected void doCommit(DefaultTransactionStatus status) {

        String transactionId = TransactionSynchronizationManager.getCurrentTransactionName();
        log.debug("doCommit: this transaction is '" + transactionId + "'");

        try {
            super.doCommit(status);
        }
        catch (Exception e) {
            log.error("doCommit: failed for transaction '" + transactionId + "'" + e);
            throw e;
        }
        finally {
        }
    }

    @Override
    protected void doRollback(DefaultTransactionStatus status) {

        String transactionId = TransactionSynchronizationManager.getCurrentTransactionName();
        log.error("doRollback for transaction '" + transactionId + "'");

        try {
            super.doRollback(status);
        }
        finally {
        }
    }

/*    private void processEvents(TransactionTrackerInfo transactionInfo) {

        try {
            final List<Event> events = transactionInfo.getEvents();
            if (CollectionUtils.isNotEmpty(events)) {

                log.info("transaction [" + transactionInfo.getTransactionId() + "] has " + events.size() + " events.");
                for (Event event : events) {
                    try {
                        log.info("publishing event [" + event + "] for transaction: [" + transactionInfo.getTransactionId() + "]");
                        eventService.publishEvent(event,false);
                    } catch (Exception e) {
                        log.warn("failed to publish event [" + event + "] for transaction [" + transactionInfo.getTransactionId() + "], reason: " + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Uncaught exception in CustomJpaTransactionManager.processEvents", e);
        }
    }

    private void processCamelMessages(TransactionTrackerInfo transactionInfo) {

        try {
            final List<TransactionDependentCamelMessage> camelMessages = transactionInfo.getCamelMessages();
            if (CollectionUtils.isNotEmpty(camelMessages)) {

                log.info("transaction [" + transactionInfo.getTransactionId() + "] has " + camelMessages.size() + " camelMessages.");
                for (TransactionDependentCamelMessage camelMessage : camelMessages) {
                    try {
                        log.info("publishing camelMessage [" + camelMessage.getMeaningfulIdentifier() + "] to " + camelMessage.getUri()+ " for transaction: [" + transactionInfo.getTransactionId() + "]");
                        camelTemplate.sendBody(camelMessage.getUri(), camelMessage.getExchangePattern(), camelMessage.getObject());
                    } catch (Exception e) {
                        log.warn("failed to publish camelMessage [" + camelMessage.getMeaningfulIdentifier() + "] to " + camelMessage.getUri()+ " for transaction [" + transactionInfo.getTransactionId() + "], reason: " + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Uncaught exception in CustomJpaTransactionManager.processCamelMessages", e);
        }
    }*/
}