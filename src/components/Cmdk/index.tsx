import { useState, useEffect, useRef } from 'react'
import { FiSearch, FiLink2 } from 'react-icons/fi'
import { Command } from 'cmdk'

const openNewTab = (url: string) => window.open(url, '_blank')

export const QuickLinks = () => {
  const [open, setOpen] = useState(false)
  const qlRootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onOpen = () => {
    setOpen(true)
    inputRef.current?.focus()
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '>' && event.shiftKey) {
        event.preventDefault()
        setOpen(currentOpen => {
          if (currentOpen === false) {
            inputRef.current?.focus()
          } else {
            inputRef.current?.blur()
          }
          return !currentOpen
        })
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const ql = qlRootRef.current
      const target = event.target as HTMLElement
      if (!ql?.contains(target)) {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="ql-root" data-open={open} ref={qlRootRef}>
      <Command>
        <div cmdk-input-container="" data-open={open}>
          <div className="input-shape" onClick={onOpen}>
            <FiLink2 />
            Links rápidos
          </div>
          <FiSearch />
          <Command.Input ref={inputRef} placeholder="Procurar links..." />
          <kbd>⇧</kbd>
          <kbd>{'>'}</kbd>
        </div>
        <Command.List>
          <Command.Empty>Nada encontrado.</Command.Empty>

          <Command.Group heading="Geral">
            <Command.Item
              onSelect={() =>
                openNewTab(
                  'https://github.com/leovargasdev/br-challenges-empire-burger'
                )
              }
            >
              Repositório template
            </Command.Item>
            <Command.Item>Baixar assets</Command.Item>
          </Command.Group>

          <Command.Group heading="Nível fácil">
            <Command.Item
              onSelect={() =>
                openNewTab(
                  'https://www.w3docs.com/snippets/html/how-to-create-an-anchor-link-to-jump-to-a-specific-part-of-a-page.html'
                )
              }
            >
              Anchor links
            </Command.Item>
            <Command.Item
              onSelect={() =>
                openNewTab(
                  'https://css-tricks.com/snippets/css/complete-guide-grid/'
                )
              }
            >
              Guia de como usar Grid
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Nível médio">
            <Command.Item
              onSelect={() =>
                openNewTab(
                  'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat'
                )
              }
            >
              Intl.NumberFormat()
            </Command.Item>
            <Command.Item
              onSelect={() =>
                openNewTab(
                  'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date'
                )
              }
            >
              new Date()
            </Command.Item>
          </Command.Group>
          <Command.Group heading="Nível difícil">
            <Command.Item
              onSelect={() =>
                openNewTab(
                  'https://api.brchallenges.com/api/empire-burger/menu'
                )
              }
            >
              Lista de itens do cardápio endpoint
            </Command.Item>
            <Command.Item
              onSelect={() =>
                openNewTab(
                  'https://api.brchallenges.com/api/empire-burger/testimonials'
                )
              }
            >
              Lista de depoimentos endpoint
            </Command.Item>
            <Command.Item
              onSelect={() =>
                openNewTab(
                  'https://css-tricks.com/almanac/properties/l/line-clamp/'
                )
              }
            >
              Line-clamp CSS
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
