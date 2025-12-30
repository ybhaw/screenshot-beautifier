import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PositionGrid } from '../../src/components/PositionGrid'

describe('PositionGrid', () => {
  it('renders all 9 position buttons', () => {
    render(<PositionGrid value="center" onChange={() => {}} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(9)
  })

  it('applies active class to selected position', () => {
    render(<PositionGrid value="top-left" onChange={() => {}} />)

    const topLeftButton = screen.getByTitle('top-left')
    expect(topLeftButton).toHaveClass('active')
  })

  it('calls onChange when a position is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<PositionGrid value="center" onChange={handleChange} />)

    await user.click(screen.getByTitle('bottom-right'))
    expect(handleChange).toHaveBeenCalledWith('bottom-right')
  })

  it('shows filled circle for center position', () => {
    render(<PositionGrid value="center" onChange={() => {}} />)

    const centerButton = screen.getByTitle('center')
    expect(centerButton).toHaveTextContent('●')
  })

  it('shows empty circle for non-center positions', () => {
    render(<PositionGrid value="center" onChange={() => {}} />)

    const topButton = screen.getByTitle('top')
    expect(topButton).toHaveTextContent('○')
  })
})
