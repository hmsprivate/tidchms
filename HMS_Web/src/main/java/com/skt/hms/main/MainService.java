package com.skt.hms.main;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skt.hms.main.model.MainModel;
import com.skt.hms.main.model.MainSearchModel;


@Service
public class MainService {

	@Autowired
	private MainMapper mainMapper;

	
	/**
	 * dashBoard 조회
	 * @return
	 */
	public MainModel getDashBoardStatus() {
		MainModel resultModel = mainMapper.getDashBoardStatus();
		return resultModel;
	}
	

	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<MainModel> getGroupList() throws Exception {
		List<MainModel> resultModel = mainMapper.getGroupList();
		return resultModel;
	}
	
	/**
	 * Node 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getNodeList(MainSearchModel param) throws Exception{
		return mainMapper.getNodeList(param);
	}
	
	/**
	 * Node 리스트 건수
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int getNodeCount(MainSearchModel param) throws Exception{
		return mainMapper.getNodeCount(param);
	}

}