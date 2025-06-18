module.exports = {
  VOICE_REGEX: [
    {
      regex: /^đi (.+)/i,
      type: 'direction'
    },
    {
      regex: /^từ (.+?) đến (.+)/i,
      type: 'direction'
    },
    {
      regex: /^từ (.+?) tới (.+)/i,
      type: 'direction'
    },
    {
      regex: /^từ (.+?) đi (.+)/i,
      type: 'direction'
    },
    {
      regex: /^chỉ đường từ (.+?) đến (.+)/i,
      type: 'direction'
    },
    {
      regex: /^chỉ đường từ (.+?) tới (.+)/i,
      type: 'direction'
    },
    {
      regex: /^chỉ đường từ (.+?) đi (.+)/i,
      type: 'direction'
    },
    {
      regex: /^chỉ đường đi (.+)/i,
      type: 'direction'
    },
    {
      regex: /^chỉ đường đến (.+)/i,
      type: 'direction'
    },
    {
      regex: /^chỉ đường tới (.+)/i,
      type: 'direction'
    },
    {
      regex: /^đường đi (.+)/i,
      type: 'direction'
    },
    {
      regex: /^đường đến (.+)/i,
      type: 'direction'
    },
    {
      regex: /^đường tới (.+)/i,
      type: 'direction'
    },
    {
      regex: /^dẫn đường đến (.+)/i,
      type: 'navigation'
    },
    {
      regex: /^dẫn đường đi (.+)/i,
      type: 'navigation'
    },
    {
      regex: /^dẫn đường tới (.+)/i,
      type: 'navigation'
    },
    {
      regex: /^dẫn đường từ (.+?) đến (.+)/i,
      type: 'navigation'
    },
    {
      regex: /^dẫn đường từ (.+?) đi (.+)/i,
      type: 'navigation'
    },
    {
      regex: /^dẫn đường từ (.+?) tới (.+)/i,
      type: 'navigation'
    }
  ]
}