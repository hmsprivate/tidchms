package com.skt.hms.agent;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.skt.hms.agent.model.AgentStatusModel;
import com.skt.hms.agent.model.AgentStatusSearchModel;

@Repository("AgentStatusMapper")
public interface AgentStatusMapper {
	
	/**
	 * dashBoard 조회
	 * @return
	 */
	public AgentStatusModel getDashBoardStatus();
	

	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<AgentStatusModel> getGroupList() throws Exception;

	
	/**
	 * agent status 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getAgentStatusList(AgentStatusSearchModel filter) throws Exception;
	
	
	/**
	 * agent status 리스트 건수
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public int getAgentStatusCount(AgentStatusSearchModel filter) throws Exception;

	
	/**
	 * 통합 검색에서 사용할 Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<AgentStatusModel> getCommonGroupList() throws Exception;

}
