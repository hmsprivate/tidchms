package com.skt.hms.change;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skt.hms.change.model.ChangeMgmtSearchModel;


@Service
public class ChangeMgmtService {

	@Autowired
	private ChangeMgmtMapper changeMgmtMapper;

	/**
	 * Node 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getChangeList(ChangeMgmtSearchModel param) throws Exception{
		return changeMgmtMapper.getChangeList(param);
	}
	
	/**
	 * Node 리스트 건수
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int getChangeCount(ChangeMgmtSearchModel param) throws Exception{
		return changeMgmtMapper.getChangeCount(param);
	}

}
