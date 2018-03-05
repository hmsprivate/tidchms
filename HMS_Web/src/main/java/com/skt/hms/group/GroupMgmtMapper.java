package com.skt.hms.group;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.skt.hms.group.model.GroupMgmtSearchModel;
import com.skt.hms.group.model.GroupModel;
import com.skt.hms.group.model.PluginModel;
import com.skt.hms.group.model.TaskModel;
import com.skt.hms.group.model.TrashBinModel;
import com.skt.hms.popup.model.PopupSearchModel;




@Repository("GroupMgmtMapper")
public interface GroupMgmtMapper {

	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<GroupModel> getGroupList() throws Exception;

	
	/**
	 * Plugin 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<PluginModel> getPluginList(GroupMgmtSearchModel filter) throws Exception;
	
	/*public ArrayList<Map<String,Object>> getExcelPluginList(String param) throws Exception;*/
	
	
	/**
	 * Task 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<TaskModel> getTaskList(GroupMgmtSearchModel filter) throws Exception;
	
	
	/**
	 * Node 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getNodeList(GroupMgmtSearchModel filter) throws Exception;
	
	
	/**
	 * Node 리스트 건수
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public int getNodeCount(GroupMgmtSearchModel filter) throws Exception;
	
	
	/**
	 * Plugin 정보 전체 삭제용 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<PluginModel> getPluginDelList(GroupMgmtSearchModel filter) throws Exception;
	
	/**
	 * member_info use_flag 변경(삭제는 0으로 변경/ 복구는 1로 변경)
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public Integer updateMemberUseFlag(GroupMgmtSearchModel filter) throws Exception;
	
	/**
	 * node trash bin move(삭제 insert)
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public Integer insertNodeTrashBin(GroupMgmtSearchModel filter) throws Exception;
	
	/**
	 * Node Trash Bin List 이력 정보 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<TrashBinModel> selectNodeTrashBinHistory(GroupMgmtSearchModel filter) throws Exception;
	
	
	/**
	 * node Recovery 작업
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public Integer updateNodeRecovery(GroupMgmtSearchModel filter) throws Exception;
	
}
