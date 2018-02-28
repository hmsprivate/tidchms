package com.skt.hms.DAO;

public class Member {
    //sql = "SELECT member_seq,member_name,member_host,agreement_seq FROM CM_MEMBER_INFO";
    int     member_seq;
    String  member_name;
    String  member_host;
    int     agreement_seq;
    String  lastUptime;
    int     rest_api_port;
    String  nodeStatus;

    public int getMember_seq() {
        return member_seq;
    }

    public void setMember_seq(int member_seq) {
        this.member_seq = member_seq;
    }

    public String getMember_name() {
        return member_name;
    }

    public void setMember_name(String member_name) {
        this.member_name = member_name;
    }

    public String getMember_host() {
        return member_host;
    }

    public void setMember_host(String member_host) {
        this.member_host = member_host;
    }

    public int getAgreement_seq() {
        return agreement_seq;
    }

    public void setAgreement_seq(int agreement_seq) {
        this.agreement_seq = agreement_seq;
    }

    public String getLastUptime() {
        return lastUptime;
    }

    public void setLastUptime(String lastUptime) {
        this.lastUptime = lastUptime;
    }

    public int getRest_api_port() {
        return rest_api_port;
    }

    public void setRest_api_port(int rest_api_port) {
        this.rest_api_port = rest_api_port;
    }

    public String getNodeStatus() {
        return nodeStatus;
    }

    public void setNodeStatus(String nodeStatus) {
        this.nodeStatus = nodeStatus;
    }
}









