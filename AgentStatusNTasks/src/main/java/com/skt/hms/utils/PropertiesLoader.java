package com.skt.hms.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class PropertiesLoader {

    private static final Logger logger = LoggerFactory.getLogger(PropertiesLoader.class);

    public static final String DEFAULT_PROPERTIES = "common.properties";
    public static final String VALUE_DELIMITER = ",";

    private static PropertiesLoader instance = null;
    private static Properties properties = null;

    private static boolean loading = false;

    protected PropertiesLoader() {
        properties = new Properties();
    }

    public static PropertiesLoader getInstance() {
        if (instance == null) {
            instance = new PropertiesLoader();
        }
        return instance;
    }

    public void reload(String ... files) {
        loading = false;
        load(files);
    }

    public void load(String ... files) {
        if (loading) return;

        List<String> list = new ArrayList<String>();
        list.add(DEFAULT_PROPERTIES);

        for (String file : files) {
            if (file != null && file.length() > 0) {
                list.add(file);
            }
        }

        // search properties file
        String classPath = System.getProperty("java.class.path", ".");
        String[] elements = classPath.split(System.getProperty("path.separator"));

        List<File> propFiles = new ArrayList<File>();

        for(String element : elements){
            File f = new File(element);
            propFiles.addAll(getPropertiesFile(f, list));
        }

        if (propFiles.size() < 1) return;

        // parse properties file
        for (String file : list) {
            for (File propFile : propFiles) {
                if (file.equals(propFile.getName())) {
                    parsePropertiesFile(propFile);
                }
            }
        }

        loading = true;
    }

    private List<File> getPropertiesFile(File file, final List<String> list) {
        List<File> propFiles = new ArrayList<File>();

        if (file.isDirectory()) {
            File[] fs = file.listFiles();
            for (File f : fs) {
                propFiles.addAll(getPropertiesFile(f, list));
            }
        } else if (file.isFile()) {
            String fileName = file.getName();
            if (list.contains(fileName)) {
                propFiles.add(file);
            }
        }

        return propFiles;
    }

    private void parsePropertiesFile(File propFile) {
        InputStream is = null;

        try {
            is = new FileInputStream(propFile);
            properties.load(is);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            if (is != null) try { is.close(); } catch (Exception e) {}
        }
    }

    public void trace() {
        for (Object key : properties.keySet()) {
            logger.info(key + " : [" + properties.get(key) + "]");
        }
    }

    public String getString(String name) {
        return properties.getProperty(name);
    }

    public int getInt(String name) {
        try {
            return Integer.valueOf(getString(name));
        } catch (Exception e) {
            return 0;
        }
    }

    public List<String> getList(String name) {
        List<String> list = new ArrayList<String>();

        String property = properties.getProperty(name);
        if (property == null || property.length() == 0) {
            return list;
        }

        String[] values = property.split(VALUE_DELIMITER, -1);
        if (values == null || values.length == 0) {
            return list;
        }

        for (String value : values) {
            value = value.trim();
            if (value.length() > 0) {
                list.add(value);
            }
        }

        return list;
    }

    public List<String> getKeys() {
        List<String> list = new ArrayList<String>();
        if(properties == null) return list;

        for(String key : properties.stringPropertyNames()) {
            list.add(key);
        }
        return list;
    }
}
