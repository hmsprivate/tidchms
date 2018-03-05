package com.skt.hms.plugin;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.skt.hms.plugin.model.PluginMgmtSearchModel;
import com.skt.hms.user.model.UserSaveModel;
import com.skt.hms.plugin.model.PluginMgmtModel;




@Repository("PluginMgmtMapper")
public interface PluginMgmtMapper {
	
	/**
	 * Plugin 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<PluginMgmtModel> getPluginList(PluginMgmtSearchModel filter) throws Exception;

	/**
	 * Plugin load성공시 response 값으로 데이터 업데이트
	 * @param data
	 * @return
	 * @throws Exception
	 */
	public int updatePluginInfo(PluginMgmtModel data) throws Exception;
}
