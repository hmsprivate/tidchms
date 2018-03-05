package com.skt.hms.agent;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skt.hms.agent.model.AgentStatusModel;
import com.skt.hms.agent.model.AgentStatusSearchModel;


@Service
public class AgentStatusService {

	@Autowired
	private AgentStatusMapper agentStatusMapper;

	
	/**
	 * dashBoard 조회
	 * @return
	 */
	public AgentStatusModel getDashBoardStatus() {
		AgentStatusModel resultModel = agentStatusMapper.getDashBoardStatus();
		return resultModel;
	}
	

	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<AgentStatusModel> getGroupList() throws Exception {
		List<AgentStatusModel> resultModel = agentStatusMapper.getGroupList();
		return resultModel;
	}
	
	/**
	 * agent status 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getAgentStatusList(AgentStatusSearchModel param) throws Exception{
		return agentStatusMapper.getAgentStatusList(param);
	}
	
	/**
	 * agent status 리스트 건수
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int getAgentStatusCount(AgentStatusSearchModel param) throws Exception{
		return agentStatusMapper.getAgentStatusCount(param);
	}


	/**
	 * 통합 검색에서 사용할 Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<AgentStatusModel> getCommonGroupList() throws Exception {
		List<AgentStatusModel> resultModel = agentStatusMapper.getCommonGroupList();
		return resultModel;
	}
}
