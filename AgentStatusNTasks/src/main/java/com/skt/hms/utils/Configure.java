package com.skt.hms.utils;

public class Configure {

    private static Configure instance;
    private Configure() {}
    public static Configure getInstance () {
        if ( instance == null )
            instance = new Configure();
        return instance;
    }

    PropertiesLoader prop = null;

    public void LoadProperties() {
        prop = PropertiesLoader.getInstance();
        prop.load("hms_common.properties");
    }

    public PropertiesLoader getProperties() {
        if (prop == null ) {
            LoadProperties();
        }

        return prop;
    }
}
