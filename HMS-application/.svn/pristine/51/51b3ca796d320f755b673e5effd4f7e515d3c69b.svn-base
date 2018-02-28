package com.skt.mobigen.hms.snapsynchronize.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.skt.mobigen.hms.snapsynchronize.context.Context;
import com.skt.mobigen.hms.snapsynchronize.service.IFSnapSynchronizeService;
import com.skt.mobigen.hms.snapsynchronize.utils.HttpRequestUtil;
import com.skt.mobigen.hms.snapsynchronize.utils.JsonParserUtil;

public class SnapAgreementJoinSyncService implements IFSnapSynchronizeService {
	private Logger logger = LoggerFactory.getLogger(SnapAgreementJoinSyncService.class);
	private Context context;
	private Map<String, Object> receive_data_map;

	public SnapAgreementJoinSyncService(Context context, Map<String, Object> receive_data_map) {
		this.context = context;
		this.receive_data_map = receive_data_map;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Object synchronizeService() {
		SqlSession session = null;
		try {
			session = context.getSqlSessionFactory().openSession(ExecutorType.BATCH, false);

			if (receive_data_map.get("agreement_name").toString().isEmpty()
					|| receive_data_map.get("node_name").toString().isEmpty())
				return "Invalid Json";

			String agreement_seq = session.selectOne("get_agreement_seq", receive_data_map.get("agreement_name").toString());
			Map<String, Object> connect_info = session.selectOne("get_conncet_info", receive_data_map.get("node_name").toString().trim());

			if (agreement_seq == null)
				return null;
			if (connect_info == null)
				return null;

			String p_url = "http://".concat(connect_info.get("member_host").toString().trim().concat(":"))
					.concat(connect_info.get("rest_api_port").toString().trim());
			String agreement_url = p_url.concat("/v1/tribe/agreements")
					.concat("/".concat(receive_data_map.get("agreement_name").toString().trim()));

			String response_str = null;
			try {
				logger.debug("try " + agreement_url + " Connect");
				response_str = HttpRequestUtil.sendRequest(agreement_url);
				if (response_str.isEmpty() || response_str == null)
					throw new Exception(agreement_url + " response is ".concat(response_str));

			} catch (Exception e) {
				logger.error(ExceptionUtils.getMessage(e));
				return ExceptionUtils.getMessage(e);
			}

			Map<String, Object> response_map = JsonParserUtil.jsontoMap(response_str);
			Map<String, Object> response_body = (Map<String, Object>) response_map.get("body");
			Map<String, Object> agreement_map = (Map<String, Object>) response_body.get("agreement");

			List<String> member_name_list = new ArrayList<>();
			if (agreement_map.containsKey("members")) {

				Map<String, Object> member_data_of_agreement = (Map<String, Object>) agreement_map.get("members");

				for (String member_name : member_data_of_agreement.keySet()) {
					member_name_list.add(member_name);
				}
			}

			Map<String, Object> update_data_map = new HashMap<>();
			if (!member_name_list.isEmpty())
				update_data_map.put("update_data_list", member_name_list);
			update_data_map.put("agreement_seq", Integer.parseInt(agreement_seq));

			session.update("update_init_member_agreement", agreement_seq);
			if (update_data_map.containsKey("update_data_list"))
				session.update("update_member_agreement", update_data_map);

			session.commit();
			return "completed";
		} catch (Exception e) {
			return ExceptionUtils.getMessage(e);
		} finally {
			if (session != null)
				session.close();
		}
	}

}
