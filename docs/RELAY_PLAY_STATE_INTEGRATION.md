# relay_play_state_submit 集成说明

## 修改内容

### 1. 新增 API 接口模块

**文件**: `module/relay_play_state_submit.js`

**功能**: 提交歌曲播放状态，支持会话追踪和播放模式记录

**接口地址**: `/api/relay/play/state/submit`

**参数说明**:
- `id` (必填): 歌曲 ID
- `sessionId` (必填): 播放会话 ID（12 位大写字母和数字）
- `progress` (可选): 播放进度（秒），默认 0
- `playMode` (可选): 播放模式，默认 `list_loop`
- `type` (可选): 资源类型，默认 `song`

**参数校验**:
```javascript
if (!id || !sessionId) {
  return Promise.reject({
    status: 400,
    body: {
      code: 400,
      msg: '缺少必要参数：id, sessionId',
    },
  })
}
```

### 2. 更新 API 文档

**文件**: `public/docs/home.md`

在文档末尾添加了接口说明，包括：
- 接口功能说明
- 参数列表
- 调用示例

### 3. 集成到自动任务脚本

**文件**: `auto_tasks_enhanced.js`

**修改内容**:

1. **导入接口** (Line 32):
```javascript
const {
  // ... 其他接口
  relay_play_state_submit,
  // ... 其他接口
} = require('@neteasecloudmusicapienhanced/api')
```

2. **组合使用两个接口** (Lines 447-483):
```javascript
// 2. 上传听歌记录（组合使用两个接口）
console.log('  [2] 上传播放状态...')
try {
  // 生成 sessionId（12 位大写字母和数字）
  const sessionId = Array.from({ length: 12 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')
  
  // 2.1 提交播放开始状态（relay_play_state_submit）
  const relayResult = await relay_play_state_submit({
    cookie,
    id: song.id,
    sessionId: sessionId,
    progress: 0,
    playMode: 'list_loop'
  })
  if (relayResult.body.code === 200) {
    console.log('    ✓ 播放状态已提交')
  }
  
  await sleep(1000)
  
  // 2.2 上传完整听歌记录（scrobble）
  const playTime = Math.floor(song.dt / 1000)
  const scrobbleResult = await scrobble({
    cookie,
    id: song.id,
    sourceid: playlistId,
    time: playTime
  })
  if (scrobbleResult.body.code === 200) {
    const timeStr = (playTime / 60).toFixed(2)
    console.log(`    ✓ 听歌记录已上传 (${timeStr}分钟)`)
    successCount++
  }
} catch (e) {
  console.log(`     上传失败：${e.message}`)
}
```

## 工作流程

完整的 VIP 音乐任务播放流程：

```
1. 收藏歌曲 (song_like)
   ↓
2. 提交播放状态 (relay_play_state_submit)
   ↓ (延迟 1 秒)
3. 上传听歌记录 (scrobble)
   ↓ (延迟 1 秒)
4. 等待 30-60 秒
   ↓
5. 取消收藏 (song_like)
```

## 优势

### 组合使用两个接口的好处：

1. **relay_play_state_submit**:
   - 实时播放状态同步
   - 会话追踪（sessionId）
   - 播放模式记录
   - 更符合现代播放器行为

2. **scrobble**:
   - 完整的听歌记录
   - 播放时长统计
   - 来源歌单记录
   - 用于任务完成判定

3. **组合效果**:
   - 更真实的播放行为模拟
   - 完整的数据记录
   - 提高任务完成可靠性

## Pull Request

**PR #181**: https://github.com/NeteaseCloudMusicApiEnhanced/api-enhanced/pull/181

**提交内容**:
- ✅ 新增 `module/relay_play_state_submit.js`
- ✅ 更新 `public/docs/home.md`
- ✅ 参数校验修复
- ✅ 使用示例更新

## 测试验证

接口已通过测试：
```
✓ relay_play_state_submit 成功
✓ scrobble 成功
✓ 组合使用正常
```

## 兼容性

- ✅ 保持原有 `scrobble` 接口不变
- ✅ 新增 `relay_play_state_submit` 可选使用
- ✅ 向后兼容
- ✅ 不影响现有功能
