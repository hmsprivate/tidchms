package com.skt.hms.worker;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SyncVar {
    public static final int NONE_WORK_STEP      = 0;
    public static final int SCHEULE_WORK_STEP   = 1;
    public static final int SYNC_WORK_STEP      = 2;

    private static SyncVar instance;
    private SyncVar() {}
    public static SyncVar getInstance () {
        if ( instance == null )
            instance = new SyncVar();
        return instance;
    }

    Lock reentrantLock = new ReentrantLock();
    int step = 0;

    public int getStep() {
        return step;
    }

    public void setStep(int step) {
        try {
            reentrantLock.lock();
            this.step = step;

        } finally {
            reentrantLock.unlock();
        }
    }
}
