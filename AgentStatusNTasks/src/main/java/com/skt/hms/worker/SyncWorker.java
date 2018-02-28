package com.skt.hms.worker;

import com.skt.hms.utils.Configure;
import com.skt.hms.utils.PropertiesLoader;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class SyncWorker implements Runnable {

    Configure cf = Configure.getInstance();
    PropertiesLoader prop = null;

    @Override
    public void run() {

        prop = cf.getProperties();
        int lstnPort = Integer.parseInt(prop.getString("sync_listen_port"));


        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        Server jettyServer = new Server(lstnPort);
        jettyServer.setHandler(context);

        ServletHolder jerseyServlet = context.addServlet(org.glassfish.jersey.servlet.ServletContainer.class, "/*");
        jerseyServlet.setInitOrder(0);

        // Tells the Jersey Servlet which REST service/class to load.
        jerseyServlet.setInitParameter("jersey.config.server.provider.classnames", snapTasks.class.getCanonicalName());

        try {
            jettyServer.start();
            jettyServer.join();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            jettyServer.destroy();
        }

    }

}
