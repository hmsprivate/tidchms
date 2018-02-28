package com.skt.hms;

import com.skt.hms.utils.PropertiesLoader;
import com.skt.hms.utils.Tools;
import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class dsMain {

    private static final Logger logger = LoggerFactory.getLogger(dsMain.class);

    int vmCount = 0;
    int pmCount = 0;
    int totalCount = 0;
    int hmsAgentCount = 0;
    int cmdbAgentCount = 0;
    int change_total = 0;
    int change_change = 0;
    int change_ignore = 0;
    int hmsAgentAbnormalCount=0;
    int hmsAgentNormalCount=0;
    String lastUpTime;


    PropertiesLoader prop = null;

    public void LoadProperties() {
        prop = PropertiesLoader.getInstance();
        prop.load("hms_common.properties");
    }

    public void CollectCount() {

        Connection connection = null;
        Statement st = null;
        try {
            Class.forName(prop.getString("db_driver"));
            connection = DriverManager.getConnection(prop.getString("db_url") , prop.getString("db_username"), prop.getString("db_password"));
            st = connection.createStatement();

            String sql;
            ResultSet rs;

            /*
            DateTime dt = new DateTime(DateTimeZone.UTC);
            String utcTime = dt.toString();
            //System.out.println(utcTime);
            String cday = utcTime.substring(0,10);
            //System.out.println(day);
            sql ="select count(*) from cm_node_info where left(last_change_time, 10) = '"+cday+"'";
            */

            sql = "select count(*) from cm_node_info where date(last_change_time) = date(now());";

            rs = st.executeQuery(sql);
            rs.next();
            change_change = rs.getInt(1);
            //System.out.println(change_change);

            sql = "select count(*) from cm_node_info n, cm_member_info m where m.use_flag=1 and m.member_seq = n.node_seq and n.node_type='VM'";
            rs = st.executeQuery(sql);
            rs.next();
            vmCount = rs.getInt(1);

            sql = "select count(*) from cm_node_info n, cm_member_info m where m.use_flag=1 and m.member_seq = n.node_seq and n.node_type='PM'";
            rs = st.executeQuery(sql);
            rs.next();
            pmCount = rs.getInt(1);
            totalCount = vmCount+pmCount;

            sql = "select count(*) from cm_member_info WHERE use_flag=1";
            rs = st.executeQuery(sql);
            rs.next();
            hmsAgentCount = rs.getInt(1);

            sql = "select count(*) from agent_status where status='Abnormal';";
            rs = st.executeQuery(sql);
            rs.next();
            hmsAgentAbnormalCount = rs.getInt(1);
            hmsAgentNormalCount = hmsAgentCount-hmsAgentAbnormalCount;

            logger.debug("vmCount="+vmCount+",pmCount="+pmCount+",totalCount="+totalCount+",hmsAgentCount="+hmsAgentCount);

            sql = "insert into dashboard_status(insert_time,sever_total,server_pm,server_vm,agent_cmdb,agent_hms,last_up_time,change_total,change_change,change_ignore,type,agent_abnormal,agent_normal)" +
                    " VALUES (now()" +
                    ",'" + String.valueOf(totalCount)+"'"+
                    ",'" + String.valueOf(pmCount)+"'"+
                    ",'" + String.valueOf(vmCount)+"'"+
                    ",'" + String.valueOf(cmdbAgentCount)+"'"+
                    ",'" + String.valueOf(hmsAgentCount)+"'"+
                    ",'" + String.valueOf(lastUpTime)+"'"+
                    ",'" + String.valueOf(change_total)+"'"+
                    ",'" + String.valueOf(change_change)+"'"+
                    ",'" + String.valueOf(change_ignore)+"'"+
                    ", 1" +
                    ",'" + String.valueOf(hmsAgentAbnormalCount)+"'"+
                    ",'" + String.valueOf(hmsAgentNormalCount)+"'"+
                    " )" +
                    "ON DUPLICATE KEY UPDATE " +
                    "insert_time=now()" +
                    ",sever_total='" + String.valueOf(hmsAgentCount)+"'"+
                    ",server_pm='"  + String.valueOf(pmCount)+"'"+
                    ",server_vm='"  + String.valueOf(vmCount)+"'"+
                    ",agent_cmdb='" + String.valueOf(cmdbAgentCount)+"'"+
                    ",agent_hms='" + String.valueOf(hmsAgentCount)+"'"+
                    ",last_up_time='" + String.valueOf(lastUpTime)+"'"+
                    ",change_total='" + String.valueOf(hmsAgentCount)+"'"+
                    ",change_change='" + String.valueOf(change_change)+"'"+
                    ",change_ignore='" + String.valueOf(change_ignore)+"'"+
                    ",agent_abnormal='" + String.valueOf(hmsAgentAbnormalCount)+"'"+
                    ",agent_normal='" + String.valueOf(hmsAgentNormalCount)+"'"
            ;
            st.executeUpdate(sql);

            //System.out.println(sql);
            rs.close();
            st.close();
            connection.close();

        }catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            try {
                if (st != null) st.close();
            } catch (Exception e) {
                logger.error(Tools.getPrintStackTrace(e));
            }
            try {
                if (connection != null) connection.close();
            } catch (Exception se) {
                logger.error(Tools.getPrintStackTrace(se));
            }
        }

    }

    public void GetCmdbCount() {
        Connection connection = null;
        Statement st = null;
        try {
            Class.forName(prop.getString("db_driver"));
            connection = DriverManager.getConnection(prop.getString("cmdb_url") , prop.getString("cmdb_username"), prop.getString("cmdb_password"));
            st = connection.createStatement();

            String sql;
            ResultSet rs;

            sql = "select count(*) from server_info";
            rs = st.executeQuery(sql);
            rs.next();
            cmdbAgentCount = rs.getInt(1);

        }catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            try {
                if (st != null) st.close();
            } catch (Exception e) {
                logger.error(Tools.getPrintStackTrace(e));
            }
            try {
                if (connection != null) connection.close();
            } catch (Exception se) {
                logger.error(Tools.getPrintStackTrace(se));
            }
        }

    }

    public void GetLastUpdateTime() {

        InfluxDB influxDB = InfluxDBFactory.connect(prop.getString("influx_url"), prop.getString("influx_user"), prop.getString("influx_password"));

        String qy = "select last(value),time from \"intel/facter/dmi/product/uuid\"";
        Query query = new Query(qy,prop.getString("influx_db"));
        QueryResult queryResult = influxDB.query(query);

        try {
            for (QueryResult.Result rslt : queryResult.getResults()) {
                for (QueryResult.Series series : rslt.getSeries()) {
                    List<List<Object>> lt = series.getValues();
                    String rt = String.valueOf(lt.get(0).get(0));
                    int pos = rt.lastIndexOf(".");

                    lastUpTime = rt.substring(0, pos) + "Z";

                }
            }

            logger.debug("lastUpTime=" + lastUpTime);
        }catch(Exception e) {
            logger.error(Tools.getPrintStackTrace(e));
        }
        finally {
            influxDB.close();
        }


    }

    public String ConvertTime(String utcTime){
        String timestamp = utcTime;

        DateTime dateTime = ISODateTimeFormat.dateTimeParser().parseDateTime(timestamp);
        DateTimeFormatter fmt = DateTimeFormat.forPattern("YYYY-MM-dd HH:mm:ss");
        String strDateOnly = fmt.print(dateTime);

        return strDateOnly;
    }

    public static void main(String [] args) {
        logger.error("dsMain-start !!");

        /*DateTime dt = new DateTime(DateTimeZone.UTC);
        String utcTime = dt.toString();
        System.out.println(utcTime);
        String day = utcTime.substring(0,10);
        System.out.println(day);

*/
        /*
        System.out.println(UUID.randomUUID().toString());

        String timestamp = "2017-07-20T12:33:26.988757933Z";
        int pos = timestamp.lastIndexOf(".");

        String nt = timestamp.substring(0,pos)+"Z";
        System.out.println(nt);

        */

        dsMain dm = new dsMain();
        dm.LoadProperties();

        while ( true ) {

            dm.GetLastUpdateTime();
            //dm.GetCmdbCount();
            dm.CollectCount();

            try {
                Thread.sleep(1000 * 60);  //1min
            }catch (Exception e) {
                break;
            }

        }

        logger.error("dsMain-end !!");
    }


}
