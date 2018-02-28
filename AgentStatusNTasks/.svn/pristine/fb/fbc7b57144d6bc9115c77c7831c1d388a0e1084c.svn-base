package com.skt.hms.worker;

import com.skt.hms.utils.Configure;
import com.skt.hms.utils.PropertiesLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StatusWorker implements Runnable {
    private static final Logger logger = LoggerFactory.getLogger(StatusWorker.class);
    PropertiesLoader prop = null;
    SyncVar sv = SyncVar.getInstance();
    Configure cf = Configure.getInstance();

    @Override
    public void run() {

        prop = cf.getProperties();
        int checkTime = Integer.parseInt(prop.getString("check_time"));

        while (!Thread.currentThread().isInterrupted()) {

            if(sv.getStep() ==  SyncVar.SYNC_WORK_STEP) {
                logger.debug("Sync work status !!");
                try {
                    Thread.sleep(1000 * 3);
                } catch (InterruptedException e) {

                }
                continue;
            }

            logger.debug("Start Agent status !!");
            sv.setStep(SyncVar.SCHEULE_WORK_STEP);

            OperateWork op = OperateWork.getInstance();
            op.LoadMembers("");
            op.SelectTime();
            op.GetNodeStatus();
            op.UpdateStatusFromRequest();
            op.UpdateStatusTasks();

            sv.setStep(SyncVar.NONE_WORK_STEP);

            try {
                Thread.sleep(1000 * checkTime);
            } catch (InterruptedException e) {

            }
        }
    }



}