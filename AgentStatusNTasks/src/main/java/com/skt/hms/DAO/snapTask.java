package com.skt.hms.DAO;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class snapTask implements Serializable{
    String id;
    String name;
    String deadline;
    String task_state;
    String hostNmae;
    String hostIp;

    @Expose
    String last_failure_message="";
    int    agreement_seq;
    int    member_seq;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getTask_state() {
        return task_state;
    }

    public void setTask_state(String task_state) {
        this.task_state = task_state;
    }

    public String getHostNmae() {
        return hostNmae;
    }

    public void setHostNmae(String hostNmae) {
        this.hostNmae = hostNmae;
    }

    public String getHostIp() {
        return hostIp;
    }

    public void setHostIp(String hostIp) {
        this.hostIp = hostIp;
    }

    public int getAgreement_seq() {
        return agreement_seq;
    }

    public void setAgreement_seq(int agreement_seq) {
        this.agreement_seq = agreement_seq;
    }

    public int getMember_seq() {
        return member_seq;
    }

    public void setMember_seq(int member_seq) {
        this.member_seq = member_seq;
    }

    public String getLast_failure_message() {
        return last_failure_message;
    }

    public void setLast_failure_message(String last_failure_message) {

        System.out.println("123->"+last_failure_message);

        this.last_failure_message = last_failure_message;
    }

    public String toString() {

        String str = "";

        str += "id:"+getId() +"\n";
        str += "name:"+getName() +"\n";
        str += "deadline:"+getDeadline() +"\n";
        str += "statee:"+getTask_state() +"\n";

        return str;
    }
}
