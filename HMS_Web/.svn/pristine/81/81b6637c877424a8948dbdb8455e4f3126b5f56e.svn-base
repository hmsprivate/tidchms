package com.skt.hms.change;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;
import com.skt.hms.change.model.ChangeMgmtSearchModel;

@Repository("ChangeMgmtMapper")
public interface ChangeMgmtMapper {
	
	/**
	 * Node 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getChangeList(ChangeMgmtSearchModel filter) throws Exception;
	
	
	/**
	 * Node 리스트 건수
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public int getChangeCount(ChangeMgmtSearchModel filter) throws Exception;
	
}
