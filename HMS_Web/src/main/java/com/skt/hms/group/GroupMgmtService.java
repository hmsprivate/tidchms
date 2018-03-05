package com.skt.hms.group;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skt.hms.group.model.GroupMgmtSearchModel;
import com.skt.hms.group.model.GroupModel;
import com.skt.hms.group.model.PluginModel;
import com.skt.hms.group.model.TaskModel;
import com.skt.hms.group.model.TrashBinModel;
import com.skt.hms.popup.model.PopupSearchModel;


@Service
public class GroupMgmtService {

	@Autowired
	private GroupMgmtMapper groupMgmtMapper;


	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<GroupModel> getGroupList() throws Exception {
		List<GroupModel> resultModel = groupMgmtMapper.getGroupList();
		return resultModel;
	}
	
	
	/**
	 * Plugin 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<PluginModel> getPluginList(GroupMgmtSearchModel param) throws Exception{
		List<PluginModel> resultModel = groupMgmtMapper.getPluginList(param);
		return resultModel;
	}
	
	/*public ArrayList<Map<String,Object>> getExcelPluginList(String param) throws Exception{
		ArrayList<Map<String, Object>> resultModel = groupMgmtMapper.getExcelPluginList(param);
		return resultModel;
	}*/
	
	
	/**
	 * Task 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<TaskModel> getTaskList(GroupMgmtSearchModel param) throws Exception{
		List<TaskModel> resultModel = groupMgmtMapper.getTaskList(param);
		return resultModel;
	}
	
	
	/**
	 * Node 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getNodeList(GroupMgmtSearchModel param) throws Exception{
		return groupMgmtMapper.getNodeList(param);
	}
	
	/**
	 * Node 리스트 건수
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int getNodeCount(GroupMgmtSearchModel param) throws Exception{
		return groupMgmtMapper.getNodeCount(param);
	}

	
	/**
	 * Plugin 정보 전체 삭제용 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<PluginModel> getPluginDelList(GroupMgmtSearchModel param) throws Exception{
		List<PluginModel> resultModel = groupMgmtMapper.getPluginDelList(param);
		return resultModel;
	}
	
	/**
	 * node trash bin move
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public int setNodeTrashBin(GroupMgmtSearchModel filter) throws Exception{
		int successMemberFlag = 0;
		int successTrashBin = 0;
		
		filter.setUseFlag("0");

		//단건
		if(filter.getNodeSeq() != null){
			successMemberFlag = groupMgmtMapper.updateMemberUseFlag(filter);
			if(successMemberFlag == 1){
				groupMgmtMapper.insertNodeTrashBin(filter);
			}
		}else{
			//다건
			for(int i = 0; i < filter.getNodeSeqTrashBinList().size(); i++ ){
				filter.setNodeSeq(filter.getNodeSeqTrashBinList().get(i).toString()); 
				successMemberFlag = groupMgmtMapper.updateMemberUseFlag(filter);
				
				if(successMemberFlag == 1){
					groupMgmtMapper.insertNodeTrashBin(filter);
				}
			}		
		}
		return successTrashBin;
	}
	
	/**
	 * Node Trash Bin List 이력 정보 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<TrashBinModel> getNodeTrashBinHistory(GroupMgmtSearchModel param) throws Exception{
		if(param.getStatus() != null){
			param.setStatus(param.getStatus().toUpperCase());
		}
		
		
		List<TrashBinModel> resultModel = groupMgmtMapper.selectNodeTrashBinHistory(param);
		return resultModel;
	}
	
	
	
	/**
	 * node Recovery 작업
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public int setNodeRecovery(GroupMgmtSearchModel filter) throws Exception{
		int successMemberFlag = 0;
		int successTrashBin = 0;
		
		filter.setUseFlag("1");

		//단건
		if(filter.getIdx() != null){
			successMemberFlag = groupMgmtMapper.updateMemberUseFlag(filter);
			
			if(successMemberFlag == 1){
				groupMgmtMapper.updateNodeRecovery(filter);
			}
		}else{
			//다건
			for(int i = 0; i < filter.getNodeSeqRecoveryList().size(); i++ ){
				
				filter.setIdx(filter.getIdxRecoveryList().get(i).toString()); 
				filter.setNodeSeq(filter.getNodeSeqRecoveryList().get(i).toString()); 
				
				successMemberFlag = groupMgmtMapper.updateMemberUseFlag(filter);
				
				if(successMemberFlag == 1){
					groupMgmtMapper.updateNodeRecovery(filter);
				}
			}		
		}
		return successTrashBin;
	}
	
}
