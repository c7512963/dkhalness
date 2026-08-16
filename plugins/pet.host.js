// 韩立宠物·宿主端（状态追踪 + RPC）。配合 pet.client.js 使用，idPrefix 'otter'
return {
  apply(ctx) {
    const state = {
      running: false,
      error: null,
      errorAt: 0,
      tool: null,
      toolAt: 0,
      messages: 0,
      messageAt: 0,
      updatedAt: 0,
    }
    const touch = (patch) => {
      state.updatedAt = Date.now()
      for (const k in patch) state[k] = patch[k]
    }
    const errText = (err) => {
      if (err == null) return '未知错误'
      if (typeof err === 'string') return err.slice(0, 200)
      const msg = err && typeof err.message === 'string' ? err.message : ''
      return (msg || String(err)).slice(0, 200)
    }
    ctx.on('agent/status', (payload) => {
      touch({ running: !!(payload && payload.status === 'running') })
    })
    ctx.on('agent/error', (payload) => {
      touch({ error: errText(payload && payload.error), errorAt: Date.now() })
    })
    ctx.on('agent/inbox/inserted', () => {
      touch({ messages: state.messages + 1, messageAt: Date.now() })
    })
    ctx.on('tools/result', (exec) => {
      const name = exec && (exec.tool || exec.name)
      touch({ tool: name ? String(name) : '工具', toolAt: Date.now() })
    })
    harness.handle('otter/state', async () => ({
      running: state.running,
      error: state.error,
      errorAt: state.errorAt,
      tool: state.tool,
      toolAt: state.toolAt,
      messages: state.messages,
      messageAt: state.messageAt,
      updatedAt: state.updatedAt,
    }))
  },
}
