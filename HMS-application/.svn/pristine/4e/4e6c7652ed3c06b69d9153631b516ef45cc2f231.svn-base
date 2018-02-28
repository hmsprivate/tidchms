package com.skt.mobigen.hms.snapsynchronize.service;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.skt.mobigen.hms.snapsynchronize.context.Context;
import com.skt.mobigen.hms.snapsynchronize.jobfactory.SnapSynchronizeJobFactory;

public class SnapSynchronizeService {
	private Logger logger = LoggerFactory.getLogger(SnapSynchronizeService.class);
	private Context context;

	public void setContext(Context context) {
		this.context = context;
	}

	public Object service(String reequest_json_data) {
		try {
			Object response = null;

			SnapSynchronizeJobFactory jobfactory = new SnapSynchronizeJobFactory(context);
			IFSnapSynchronizeService service = jobfactory.jobfactory(reequest_json_data);

			if (service != null) {
				response = service.synchronizeService();
			} else {
				return null;
			}

			return response;
		} catch (Exception e) {
//			logger.error(ExceptionUtils.getStackTrace(e));
			return ExceptionUtils.getMessage(e);
		}
	}
}
